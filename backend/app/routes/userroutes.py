import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, text

from app.models.claimmodels import Claim
from app.models.itemmodels import Item
from app.models.usersmodel import TokenData, User, UserCreate, UserResponse

# impoort database instance
from app.utils.database import sessiondb
from app.utils.hash import Hash

# for making protected routes
from app.utils.oauth import protected
from app.utils.tokenvalidation import create_access_token, verify_token


async def get_current_user(token: protected, db: sessiondb):
    token_data: TokenData = verify_token(token)
    rs = await db.execute(select(User).where(User.username == token_data.username))
    existing_user = rs.scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Not Authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return existing_user


userrouter = APIRouter()


@userrouter.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: sessiondb
):
    rs = await db.execute(select(User).where(User.username == form_data.username))
    hash = Hash()
    existing_user = rs.scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="User doesnot exist, please register",
        )

    verified = hash.verify(form_data.password, existing_user.password)

    if not verified:
        raise HTTPException(
            status_code=400,
            detail="Password doesnot match try again",
        )
    token = create_access_token({"username": existing_user.username})
    return {"access_token": token, "token_type": "bearer"}


@userrouter.post("/register")
async def register(user: UserCreate, db: sessiondb):
    rs = await db.execute(select(User).where(User.email == user.email))
    existing_user = rs.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    # Regex patterns
    email_regex = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    phone_regex = r"^[0-9]{10}$"
    password_regex = (
        r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)"
        r"(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    )

    if not re.fullmatch(email_regex, user.email):
        raise HTTPException(status_code=400, detail="Invalid email address")

    if not re.fullmatch(phone_regex, user.phone):
        raise HTTPException(
            status_code=400, detail="Phone number must be exactly 10 digits"
        )

    if not re.fullmatch(password_regex, user.password):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least 8 characters long and contain "
                "one uppercase letter, one lowercase letter, one digit, "
                "and one special character (@$!%*?&)."
            ),
        )

    hash = Hash()
    hashed_pass = hash.bcrypt(user.password)

    new_user = User(
        email=user.email,
        username=user.username,
        password=hashed_pass,
        fullname=user.fullname,
        department=user.department,
        phone=user.phone,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return UserResponse(
        id=new_user.user_id,
        username=new_user.username,
        email=new_user.email,
        department=new_user.department,
        phone=new_user.phone,
        role=new_user.role,
        fullname=new_user.fullname,
    )


@userrouter.get("/getme")
async def get_token(token: protected, db: sessiondb):
    current_user = await get_current_user(token, db)
    r_user = UserResponse(
        id=current_user.user_id,
        username=current_user.username,
        email=current_user.email,
        department=current_user.department,
        phone=current_user.phone,
        role=current_user.role,
        fullname=current_user.fullname,
    )
    return r_user


@userrouter.get("/user/{user_id}")
async def get_user(_: protected, db: sessiondb, user_id: int):
    rs = await db.execute(select(User).where(User.user_id == user_id))
    user = rs.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    r_user = UserResponse(
        id=user.user_id,
        username=user.username,
        email=user.email,
        department=user.department,
        phone=user.phone,
        role=user.role,
        fullname=user.fullname,
    )
    return r_user


@userrouter.get("/posts")
async def get_all_posts(db: sessiondb, token: protected):
    current_user = await get_current_user(token, db)
    query = await db.execute(select(Item).where(Item.posted_by == current_user.user_id))
    posts = query.scalars().all()
    return posts


@userrouter.get("/claims")
async def get_all_claims(db: sessiondb, token: protected):
    current_user = await get_current_user(token, db)
    query = await db.execute(
        select(Claim).where(Claim.claimed_by == current_user.user_id)
    )
    claims = query.scalars().all()
    return claims


@userrouter.get("/dashboard")
async def get_stat(db: sessiondb, token: protected):
    current_user = await get_current_user(token=token, db=db)
    total_items = await db.execute(
        text("SELECT COUNT(*) FROM items WHERE posted_by = :posted_by"),
        {"posted_by": current_user.user_id},
    )

    total_claims = await db.execute(
        text("SELECT COUNT(*) FROM claims WHERE claimed_by = :claimed_by"),
        {"claimed_by": current_user.user_id},
    )

    total_pending_items = await db.execute(
        text("""
            SELECT COUNT(*)
            FROM items
            WHERE status = 'pending'
                AND posted_by = :posted_by
        """),
        {"posted_by": current_user.user_id},
    )

    total_pending_claims = await db.execute(
        text("""
            SELECT COUNT(*)
            FROM claims
            WHERE claim_status = 'pending'
                AND claimed_by = :claimed_by
        """),
        {"claimed_by": current_user.user_id},
    )

    return {
        "total_items": total_items.scalar(),
        "total_claims": total_claims.scalar(),
        "total_pending_posts": total_pending_items.scalar(),
        "total_pending_claims": total_pending_claims.scalar(),
    }

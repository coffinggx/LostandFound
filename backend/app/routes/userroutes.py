from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from app.utils.tokenvalidation import create_access_token, verify_token
from sqlalchemy import select

from app.models.usersmodel import TokenData, User, UserCreate,  UserResponse

from app.utils.database import sessiondb
from app.utils.hash import Hash

from fastapi.security import OAuth2PasswordRequestForm

# for making protected routes
from app.utils.oauth import protected

# impoort database instance
from app.utils.database import sessiondb


async def get_current_user(token: protected, db:sessiondb):
    token_data: TokenData = verify_token(token)
    rs = await db.execute(select(User).where(User.email == token_data.email))
    existing_user = rs.scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Not Authenticated",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    return existing_user

userrouter = APIRouter()


@userrouter.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: sessiondb):
    rs = await db.execute(select(User).where(User.email == form_data.username))
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
    token = create_access_token({"email": existing_user.email})
    return {"access_token": token, "token_type":"bearer"}


@userrouter.post("/register")
async def register(user: UserCreate, db: sessiondb):
    rs = await db.execute(select(User).where(User.email == user.email))
    existing_user = rs.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=300, detail="User already Exists")
    hash = Hash()
    print(user.password)
    hashed_pass = hash.bcrypt(user.password)
    new_user = User(
        email=user.email,
        password=hashed_pass,
        fullname=user.fullname,
        department=user.department,
        phone=user.phone,
    )

    r_user = UserResponse(
        id = new_user.user_id,
        email= new_user.email,
        department= new_user.department,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return r_user


@userrouter.get("/getme")
async def get_token(token: protected):
    return token

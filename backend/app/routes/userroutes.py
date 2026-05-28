from fastapi import APIRouter, HTTPException

from app.utils.tokenvalidation import create_access_token
from sqlalchemy import select

from app.models.usersmodel import User, UserCreate, UserLogin

from app.utils.database import sessiondb
from app.utils.hash import Hash

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

SECRET_KEY = "fffffff"
ALGORITHM = "HS256"
TOKEN_EXPIRES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

userrouter = APIRouter()


@userrouter.post("/login")
async def login(user: UserLogin, db: sessiondb):
    rs = await db.execute(select(User).where(User.username == user.username))
    hash = Hash()
    existing_user = rs.scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="User doesnot exist, please register",
        )
    verified = hash.verify(user.password, existing_user.password)

    if not verified:
        raise HTTPException(
            status_code=400,
            detail="Password doesnot match try again",
        )
    token = create_access_token({"username": user.username})
    return {"Msg": "User logined successfully", "username": user.username, "token": token}


@userrouter.post("/register")
async def register(user: UserCreate, db: sessiondb):
    rs = await db.execute(select(User).where(User.username == user.username))
    existing_user = rs.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=300, detail="User already Exists")
    hash = Hash()
    print(user.password)
    hashed_pass = hash.bcrypt(user.password)
    new_user = User(
        username=user.username,
        password=hashed_pass,
        email=user.email,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


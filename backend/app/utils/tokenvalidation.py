import os
from jose import jwt

from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException
from jose.exceptions import JWTClaimsError

from app.models.usersmodel import TokenData

load_dotenv()

ALGORITHM_ENV = os.getenv("ALGORITHM")
SECRET_ENV = os.getenv("SECRET_KEY")
EXPIRY = int(os.getenv("EXPIRES_ON", "15"))

if ALGORITHM_ENV is None:
    raise ValueError("ALGORITHM is missing")

if SECRET_ENV is None:
    raise ValueError("SECRET_KEY is missing")

ALGORITHM: str = ALGORITHM_ENV
SECRET: str = SECRET_ENV


def create_access_token(data: dict, expire_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = (
        datetime.now(timezone.utc) + expire_delta
        if expire_delta
        else datetime.now(timezone.utc) + timedelta(minutes=EXPIRY)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


def verify_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not verify credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])

        email= payload.get("sub")

        if email is None:
            raise credentials_exception

        return TokenData(email=email)

    except JWTClaimsError:
        raise credentials_exception

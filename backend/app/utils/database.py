from dotenv import load_dotenv
import os

from sqlalchemy.orm import DeclarativeBase

# global DeclarativeBase class
class Base(DeclarativeBase):
    pass

from typing import Annotated
from fastapi import Depends

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)

load_dotenv()

DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_URL = os.getenv("DATABASE_URL")


# asyncmy is mysql driver

# engine to connect Fastapi and mysql as Fastapi <-> Engine <-> MySQL
engine = create_async_engine(DATABASE_URL, echo=True)

# creating a session : temp conversation with database
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session  # yeild converts regular func into generator fn



# for simpler use od type
sessiondb = Annotated[AsyncSession, Depends(get_db)]

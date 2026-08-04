from dotenv import load_dotenv
import os
import ssl

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

load_dotenv()


# Base model
class Base(DeclarativeBase):
    pass


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")


# Create SSL context (required for TiDB Cloud)
ssl_context = ssl.create_default_context()


# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={
        "ssl": ssl_context,
    },
)


# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Type alias for dependency injection
sessiondb = Annotated[AsyncSession, Depends(get_db)]
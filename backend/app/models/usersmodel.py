from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel
from sqlalchemy import DateTime, ForeignKey, String, Text, func, null
from sqlalchemy.orm import Mapped, mapped_column

from app.utils.database import Base


# enum class for user role
class Role(Enum):
    ADMIN = "admin"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(20), nullable=False)
    fullname: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Optional[Role]] = mapped_column(default=Role.USER, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), default=null)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )


# class for keeping tracks of what admin does
class AdminActions(Base):
    __tablename__ = "admin_actions"
    action_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.item_id"), nullable=False)
    remarks: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )


# class for register Form
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    fullname: str
    phone:str
    department: str


# class for returning after login
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    department: str
    role: Role | None
    fullname: str
    phone: str | None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# class for login form
class UserLogin(BaseModel):
    username: str
    password: str

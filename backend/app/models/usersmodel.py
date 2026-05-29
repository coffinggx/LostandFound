from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from pydantic import BaseModel

from app.utils.database import Base

# enum class for user role
class Role(Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    fullname: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(default=Role.USER, nullable=False)
    phone: Mapped[str] = mapped_column(String(20))
    department: Mapped[str] = mapped_column(String(100), nullable=False) 
    created_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)

# class for keeping tracks of what admin does
class AdminActions(Base):
    __tablename__ = "admin_actions"
    action_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    admin_id: Mapped[int]  = mapped_column(ForeignKey("users.user_id"),nullable=False)
    item_id: Mapped[int]  = mapped_column(ForeignKey("items.item_id"),nullable=False)
    remarks: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)


# class for register Form
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str]
    department: str
    role: str

# class for returning after login
class UserResponse(BaseModel):
    id: int
    email: str
    department: str
    role: str

    class config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# class for login form
class UserLogin(BaseModel):
    email: str
    password: str

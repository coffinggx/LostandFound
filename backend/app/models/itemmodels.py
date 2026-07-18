from datetime import datetime
from enum import Enum
from typing import Optional
from fastapi import UploadFile,Form
from pydantic import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy import DateTime, ForeignKey, String, Text,func
from app.utils.database import Base

# Enum class for item
class ItemType(str,Enum):
    LOST = "lost"
    FOUND = "found"

#Enum class for post status
class Approval(str,Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    PENDING = "pending"

# Enum class for itemstatus
class ItemStatus(str,Enum):
    OPEN = "open"
    CLAIMED = "claimed"
    RETURNED = "returned"

    def parse(self,status:str):
        if status == "open":
            return self.OPEN
        elif status == "claimed":
            return self.CLAIMED
        else:
            return self.RETURNED


# Lost or Found Class (ORM - Class and db is mapped)
class Item(Base):
    __tablename__ = "items"
    item_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    item_type: Mapped[ItemType] = mapped_column(nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.category_id"), nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    date_lost_found: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    status: Mapped[ItemStatus] = mapped_column(nullable = False, default=ItemStatus.OPEN)
    approval: Mapped[Approval] = mapped_column(nullable = False, default=Approval.PENDING)
    posted_by: Mapped[int] = mapped_column(ForeignKey("users.user_id"),nullable =False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default= func.now() ,nullable=False)


class CreatePost(BaseModel):
    title: str
    description: str
    category_name: str
    location: str
    item_type: ItemType
    item_status: ItemStatus
    # we need this beacuse fastapi serialize this and when we add images it serialize it into bits which give error
    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        description: str = Form(...),
        category_name: str = Form(...),
        location: str = Form(...),
        item_type: ItemType = Form(...),
        item_status: ItemStatus = Form(...),
    ):
        return cls(
            title=title,
            description=description,
            category_name=category_name,
            location=location,
            item_type=item_type,
            item_status=item_status,
        )

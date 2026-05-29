from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy import DateTime, ForeignKey, String, Text
from app.utils.database import Base


# Enum class for item
class ItemType(Enum):
    LOST = "lost"
    FOUND = "found"

# Enum class for itemstatus
class ItemStatus(Enum):
    OPEN = "open"
    CLAIMED = "claimed"
    RETURNED = "returned"

# Lost or Found Class (ORM - Class and db is mapped)
class Item(Base):
    __tablename__ = "items"
    item_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    item_type: Mapped[ItemType] = mapped_column(nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.category_id"), nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(250), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    date_lost_found: Mapped[datetime] = mapped_column(DateTime,nullable=False)
    status: Mapped[ItemStatus] = mapped_column(nullable = False)
    posted_by: Mapped[int] = mapped_column(ForeignKey("users.user_id"),nullable =False)
    created_at: Mapped[datetime] = mapped_column(DateTime,nullable=False)

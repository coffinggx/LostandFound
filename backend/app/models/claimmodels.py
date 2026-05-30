from enum import Enum
from sqlalchemy import Text,ForeignKey, DateTime,func
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.utils.database import Base

# class enum for claimstatus
class ClaimStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Claim(Base):
    __tablename__ = "claims"

    claim_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    item_id: Mapped[int]  = mapped_column(ForeignKey("items.item_id"),nullable=False)
    claimed_by: Mapped[int]  = mapped_column(ForeignKey("users.user_id"),nullable=False)
    claim_message: Mapped[str] = mapped_column(Text, nullable=False)
    claim_status: Mapped[ClaimStatus] = mapped_column(default=ClaimStatus.PENDING, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default= func.now() ,nullable=False)
   


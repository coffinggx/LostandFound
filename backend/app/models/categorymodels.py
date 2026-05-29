from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.utils.database import Base

class Category(Base):
    __tablename__ = "categories"

    category_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    category_name: Mapped[str] = mapped_column(String(50), nullable=False)


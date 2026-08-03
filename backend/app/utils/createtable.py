import asyncio

from app.models.categorymodels import Category
from app.models.claimmodels import Claim
from app.models.itemmodels import Item
from app.models.usersmodel import AdminActions, User
from app.utils.database import Base, engine


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(create_tables())

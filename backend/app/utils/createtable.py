import asyncio
from app.utils.database import engine,Base
from app.utils.database import Base

from app.models.usersmodel import User, AdminActions
from app.models.itemmodels import Item
from app.models.claimmodels import Claim
from app.models.categorymodels import Category

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(create_tables())

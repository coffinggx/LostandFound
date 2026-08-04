from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from app.routes.adminroutes import adminRoutes as adminRouter
from app.routes.adminroutes import get_current_admin
from app.routes.claimroutes import claimRouter
from app.routes.itemroutes import router as itemRouter
from app.routes.userroutes import userrouter as userRouter

# Import Base, engine, and ALL models
from app.utils.database import Base, engine

from app.models.usersmodel import User, AdminActions
from app.models.itemmodels import Item
from app.models.claimmodels import Claim
from app.models.categorymodels import Category

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    # Optional cleanup
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "https://lost-and-found-git-main-coffinggxs-projects.vercel.app",
    "https://lostand-found-git-main-coffinggxs-projects.vercel.app",
    "https://lostandfound.vercel.app",
    "https://lostand-found-beta.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(userRouter, prefix="/api/v1/user")
app.include_router(itemRouter, prefix="/api/v1/item")
app.include_router(claimRouter, prefix="/api/v1/claim")
app.include_router(
    adminRouter,
    prefix="/api/v1/admin",
    dependencies=[Depends(get_current_admin)],
)
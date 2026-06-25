# importing fastapi
from fastapi import FastAPI

from app.routes.userroutes import userrouter as userRouter
from app.routes.itemroutes import router as itemRouter
from app.routes.claimroutes import claimRouter
from app.routes.adminroutes import adminRoutes as adminRouter

# Instance of fast api as router
app = FastAPI()
app.include_router(userRouter, prefix="/api/v1/user")
app.include_router(itemRouter, prefix="/api/v1/item")
app.include_router(claimRouter, prefix="/api/v1/claim")
app.include_router(adminRouter, prefix="/api/v1/admin")

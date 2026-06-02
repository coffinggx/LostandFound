# importing fastapi
from fastapi import FastAPI

from app.routes.userroutes import userrouter
from app.routes.itemroutes import router as itemrouter

# Instance of fast api as router
app = FastAPI()
app.include_router(userrouter)
app.include_router(itemrouter)

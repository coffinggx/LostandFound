# importing fastapi
from fastapi import FastAPI

from app.routes.userroutes import userrouter

# Instance of fast api as router
app = FastAPI()
app.include_router(userrouter)

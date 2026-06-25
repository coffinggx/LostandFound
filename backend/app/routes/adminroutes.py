from fastapi import APIRouter, HTTPException
from app.utils.database import sessiondb
from app.utils.oauth import protected
from app.routes.userroutes import get_current_user
from app.models.usersmodel import Role
from app.models.claimmodels import Claim, ClaimStatus
from app.models.itemmodels import Item, ItemStatus
from sqlalchemy import select 
adminRoutes = APIRouter();


@adminRoutes.patch("/claim_id")
async def updateClaim(claim_id: int,status: str, db: sessiondb, token: protected):
    current_user = await get_current_user(token, db)
    if current_user.role !=  Role.ADMIN:
        raise HTTPException(status_code=404, detail = "Unauthorized user")
    cquery = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    crs = cquery.scalar_one_or_none()
    if crs is None:
        raise HTTPException(status_code=400, detail = "Claim not found")
    crs.claim_status = ClaimStatus(status)
    await db.commit()
    await db.refresh(crs)

    if status == "approved":
        post_id = crs.item_id
        iquery = await db.execute(select(Item).where(Item.item_id==post_id))
        irs = iquery.scalar_one_or_none()
        if irs is None:
            raise HTTPException(status_code=400, detail = "Post not found")
        irs.status = ItemStatus.RETURNED
        await db.commit()
        await db.refresh(irs)
    return {"details": "claim status updated"}

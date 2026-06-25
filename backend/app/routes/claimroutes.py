# create claim
# edit claim message
# delete claim
# dont need to update status that is handled by admin(ig)

from sqlalchemy import delete, select
from app.models.claimmodels import Claim, CreateClaim
# from app.models.usersmodel import User
from app.utils.database import sessiondb
from app.routes.userroutes import get_current_user, protected
from fastapi import APIRouter, HTTPException

claimRouter = APIRouter()


@claimRouter.get("/id")
async def get_claim(id: int, db: sessiondb, _: protected):
    rs = await db.execute(select(Claim).where(Claim.claim_id == id))
    claimrs = rs.scalar_one_or_none()

    if claimrs is None:
        raise HTTPException(detail="Claim is not available", status_code=404)

    return claimrs


@claimRouter.post("/create")
async def create_claim(claim: CreateClaim, db: sessiondb, _: protected):
    claim_f = Claim(
        item_id=claim.item_id,
        claimed_by=claim.claimed_by,
        claim_msg=claim.claim_message,
    )
    db.add(claim_f)
    await db.commit()
    await db.refresh(claim_f)
    return claim_f


@claimRouter.delete("/claim_id")
async def delete_claim(claim_id: int, db: sessiondb, token: protected):
    rs = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    claim_ps = rs.scalar_one_or_none()
    if claim_ps is None:
        raise HTTPException(status_code=404, detail="post not found")
    user_id = claim_ps.claimed_by
    current_user = await get_current_user(token, db)
    if user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Unauthorized user")

    result = await db.execute(delete(Claim).where(Claim.claimed_by == user_id))
    return {"detail": "Claim deleted Successfully", "result": result}


@claimRouter.patch("/claim_id")
async def edit_claim(claim_id: int,claim: CreateClaim,  db: sessiondb, _: protected):
    rs = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    claim_ps = rs.scalar_one_or_none()
    if claim_ps is None:
        raise HTTPException(status_code=404, detail="post not found")
    claim_ps.claim_message = claim.claim_message;
    await db.commit()
    await db.refresh(claim)
    return {"details": "claim updated!", "updated_claim": claim}

from fastapi import APIRouter, HTTPException, status
from app.utils.database import sessiondb
from app.utils.oauth import protected
from app.routes.userroutes import get_current_user
from app.models.usersmodel import Role
from app.models.claimmodels import Claim, ClaimStatus
from app.models.itemmodels import Item, Approval
from sqlalchemy import select, text

adminRoutes = APIRouter()


async def get_current_admin(
    token: protected,
    db: sessiondb,
):
    user = await get_current_user(token, db)
    if user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


@adminRoutes.patch("/claims/{claim_id}/approve")
async def approve_claim(claim_id: int, _: protected, db: sessiondb):
    rs = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    claim = rs.scalar_one_or_none()
    if claim is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found",
        )

    claim.claim_status = ClaimStatus.APPROVED
    await db.commit()
    await db.refresh(claim)
    return {"detail": "Claim approved", "claim": claim}


@adminRoutes.patch("/claims/{claim_id}/reject")
async def reject_claim(claim_id: int, _: protected, db: sessiondb):
    rs = await db.execute(select(Claim).where(Claim.claim_id == claim_id))
    claim = rs.scalar_one_or_none()
    if claim is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found",
        )

    claim.claim_status = ClaimStatus.REJECTED
    await db.commit()
    await db.refresh(claim)
    return {"detail": "Claim rejected", "claim": claim}


@adminRoutes.patch("/items/{item_id}/reject")
async def reject_post(item_id: int, _: protected, db: sessiondb):
    rs = await db.execute(select(Item).where(Item.item_id == item_id))
    item = rs.scalar_one_or_none()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    item.approval = Approval.REJECTED
    await db.commit()
    await db.refresh(item)
    return {"detail": "Item rejected", "post": item}


@adminRoutes.patch("/items/{item_id}/approve")
async def approve_post(item_id: int, _: protected, db: sessiondb):
    rs = await db.execute(select(Item).where(Item.item_id == item_id))
    item = rs.scalar_one_or_none()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    item.approval = Approval.APPROVED
    await db.commit()
    await db.refresh(item)
    return {"detail": "Item Approved", "post": item}


@adminRoutes.get("/items/pending")
async def get_pending_items(db: sessiondb, _: protected):
    rs = await db.execute(select(Item).where(Item.approval == Approval.PENDING))
    items = rs.scalars().all()
    if not items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Posts not found",
        )

    return items


@adminRoutes.get("/claims/pending")
async def get_pending_claims(db: sessiondb, _: protected):
    rs = await db.execute(
        select(Claim).where(Claim.claim_status == ClaimStatus.PENDING)
    )
    claims = rs.scalars().all()
    if not claims:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="claims not found",
        )
    return claims


@adminRoutes.get("/dashboard")
async def get_stat(db: sessiondb, _: protected):
    sql = text("SELECT COUNT(*) FROM users")
    total_users = await db.execute(sql)
    total_items = await db.execute(text("SELECT COUNT(*) FROM items"))
    total_claims = await db.execute(text("SELECT COUNT(*) FROM claims"))
    total_pending_items = await db.execute(
        text("SELECT COUNT(*) FROM items WHERE status = 'pending'")
    )
    total_pending_claims = await db.execute(
        text("SELECT COUNT(*) FROM claims WHERE claim_status = 'pending'")
    )
    return_dict = {
            "total_users": total_users.scalar(),
            "total_items": total_items.scalar(),
            "total_claims": total_claims.scalar(),
            "total_pending_posts": total_pending_items.scalar(),
            "total_pending_claims": total_pending_claims.scalar()
    }
    return return_dict


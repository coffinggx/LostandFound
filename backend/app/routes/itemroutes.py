#done 
# /posts -> get all items
# /create
# /edit/:id -> Also include like updating the post to found
# /delete/:id

from datetime import datetime
from fastapi import APIRouter, File, HTTPException, status, Depends, UploadFile, File
from app.models.categorymodels import Category
from app.models.claimmodels import Claim
from app.routes.userroutes import get_current_user
from app.utils.database import sessiondb
from app.utils.oauth import protected
from app.models.itemmodels import Item, CreatePost, ItemStatus

from sqlalchemy import delete, select

from app.utils.cloudinary import upload_image

from typing import Annotated

router = APIRouter()



@router.post("/create")
async def create_post(token:protected,db: sessiondb,post: Annotated[CreatePost,Depends(CreatePost.as_form)],image:UploadFile | None = File(None) ):
    category_rs = await db.execute(select(Category).where(Category.category_name == post.category_name))
    category = category_rs.scalar_one_or_none()
    if category is None:
        category = Category(category_name=post.category_name)
        db.add(category)
        await db.commit()
        await db.refresh(category)

    current_user = await get_current_user(token, db)
    url = None
    if image is not None:
        try:
            url = await upload_image(image)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)
    a_post = Item(
        title=post.title,
        description=post.description,
        category_id=category.category_id,
        date_lost_found=datetime.now(),
        location=post.location,
        image_url = url,
        status = post.item_status,
        item_type = post.item_type,
        posted_by=current_user.user_id,
    )
    db.add(a_post)
    await db.commit()
    await db.refresh(a_post)
    return a_post


@router.get("/posts")
async def get_all_posts(db: sessiondb,_: protected):
    query = await db.execute(select(Item))
    posts = query.scalars().all()
    return posts


@router.get("/posts/{post_id}")
async def get_post(post_id: int, db: sessiondb, _: protected):
    query = await db.execute(select(Item).where(Item.item_id == post_id))
    post = query.scalar_one_or_none()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not availlable")
    return post

@router.delete("/delete/{post_id}")
async def delete_post(post_id: int, db: sessiondb, _:protected):
    rs = await db.execute(delete(Item).where(Item.item_id == post_id))
    rs = rs.scalar_one_or_none()
    if rs is None:
        raise HTTPException(status_code=404, detail="Post not availlable")
    await db.commit()
    return {"detail": f"deleted {rs.rowcount}"}

@router.patch("/edit/{post_id}")
async def edit_post(post_id: int,  token:protected,db: sessiondb, post: Annotated[CreatePost, Depends(CreatePost.as_form)],image: UploadFile | None = File(None)):
    rs = await db.execute(select(Item).where(Item.item_id == post_id))
    item = rs.scalar_one_or_none()

    if item is None:
        raise HTTPException(status_code=404, detail="Post not availlable")
    user = await get_current_user(token,db);

    if item.posted_by != user.user_id:
        raise HTTPException(status_code=400, detail="Only author can edit posts")

    category_rs = await db.execute(select(Category).where(Category.category_name == post.category_name))
    category = category_rs.scalar_one_or_none()
    if category is None:
        category = Category(category_name=post.category_name)
        db.add(category)
        await db.commit()
        await db.refresh(category)

    if image is not None:
        try:
            item.image_url = await upload_image(image)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

    item.title = post.title
    item.description = post.description
    item.category_id = category.category_id
    item.location = post.location
    item.item_type = post.item_type
    item.status = post.item_status

    await db.commit()
    await db.refresh(item)
    return {"detail": "Post updated successfully", "updated_post": item}


@router.get("/item/{item_id}/claims")
async def get_claims_items(item_id: int, _:protected,db: sessiondb):
    rs = await db.execute(select(Claim).where(Claim.item_id == item_id));
    claims = rs.scalars().all()
    if not claims:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claims not available");
    return claims

@router.get("/item/returned")
async def get_items_returned( _:protected,db: sessiondb):
    rs = await db.execute(select(Item).where(Item.status == ItemStatus.RETURNED))
    items = rs.scalars().all()
    if not items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="items not available");
    return items

@router.patch("/item/{item_id}/returned")
async def flag_returned(item_id: int, db:sessiondb, token:protected):
    rs = await db.execute(select(Item).where(Item.item_id == item_id))

    current_user = await get_current_user(token, db)

    item = rs.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not available");
    if item.posted_by != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to do this operation");

    item.status = ItemStatus.RETURNED;

    await db.commit()
    await db.refresh(item)
    return {"detail": "operation successfull"}

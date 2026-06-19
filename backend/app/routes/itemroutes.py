#done 
# /posts -> get all items
# /create
# /edit/:id -> Also include like updating the post to found
# /delete/:id

from fastapi import APIRouter, HTTPException
from app.models.categorymodels import Category
from app.routes.userroutes import get_current_user
from app.utils.database import sessiondb
from app.utils.oauth import protected
from app.models.itemmodels import Item, CreatePost

from sqlalchemy import delete, select, update, values, insert


router = APIRouter()



@router.post("/create")
async def create_post(post: CreatePost, db: sessiondb, token: protected):
    category = Category(category_name=post.category_name)
    db.add(category)
    await db.commit()
    await db.refresh(category)
    current_user = await get_current_user(token, db)
    a_post = Item(
        title=post.title,
        description=post.description,
        image_url=post.image_url,
        category_id=category.category_id,
        date_lost_found=post.date_lost_found,
        location=post.location,
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

@router.post("/edit/{post_id}")
async def edit_post(post_id: int, db: sessiondb, post: CreatePost):
    rs = await db.execute(select(Item).where(Item.item_id == post_id))
    item = rs.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Post not availlable")
    crs = await db.execute(select(Category).where(Category.category_id ==item.category_id))
    citem = crs.scalar_one_or_none()
    if citem is None:
        raise HTTPException(status_code=404, detail="Category not availlable")
    item.title = post.title
    item.description = post.description
    item.category_id = citem.category_id
    item.image_url = post.image_url
    item.location = post.location
    item.date_lost_found = post.date_lost_found
    item.item_type = post.item_type
    item.status = post.item_status

    await db.commit()
    await db.refresh(item)
    return {"detail": "Post updated successfully", "updated_post": item}


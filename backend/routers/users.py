from fastapi import APIRouter, HTTPException, Body, Depends
from backend.data_services.mongo.user_repository import (
    list_users, get_user_by_id, create_user, update_user, delete_user
)
from bson import ObjectId
from backend.routers.auth_utils import get_current_user

router = APIRouter()

def to_str_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

@router.get("/users")
def api_list_users(current_user: dict = Depends(get_current_user)):
    users = list_users(user_id=current_user["user_id"])
    return {"users": [to_str_id(u) for u in users]}

@router.get("/users/{user_id}")
def api_get_user(user_id: str):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return to_str_id(user)

@router.post("/users")
def api_create_user(user: dict = Body(...)):
    new_user = create_user(user)
    return to_str_id(new_user)

@router.put("/users/{user_id}")
def api_update_user(user_id: str, update: dict = Body(...)):
    updated = update_user(user_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return to_str_id(updated)

@router.delete("/users/{user_id}")
def api_delete_user(user_id: str):
    result = delete_user(user_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"deleted": True} 
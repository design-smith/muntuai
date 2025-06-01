from fastapi import APIRouter, HTTPException, Request, Depends
from backend.data_services.mongo.user_repository import upsert_user_from_supabase, get_user_by_id, get_user_by_email
from backend.routers.auth_utils import get_current_user
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()
logger = logging.getLogger("auth")

def serialize_user(user):
    user = dict(user)
    if '_id' in user:
        user['_id'] = str(user['_id'])
    # Convert datetime fields to isoformat if present
    for key in ['created_at', 'updated_at', 'last_login']:
        if key in user and hasattr(user[key], 'isoformat'):
            user[key] = user[key].isoformat()
    return user

@router.post("/auth/register_user")
async def register_user(current_user: dict = Depends(get_current_user)):
    try:
        logger.info("/auth/register_user called")
        payload = current_user['user']
        logger.info(f"Payload from JWT: {payload}")
        auth_data = {
            "id": payload["sub"],
            "email": payload["email"],
            "user_metadata": payload.get("user_metadata", {"full_name": payload.get("name", "")})
        }
        logger.info(f"Auth data to upsert: {auth_data}")
        user = upsert_user_from_supabase(auth_data)
        logger.info(f"User upserted: {user}")
        if not user:
            logger.error("User registration failed")
            raise HTTPException(status_code=500, detail="User registration failed")
        user = serialize_user(user)
        is_first_login = user.pop("is_first_login", False)
        return {"user": user, "is_first_login": is_first_login}
    except Exception as e:
        logger.error(f"Exception in /auth/register_user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/sync_user")
async def sync_user(request: Request):
    try:
        logger.info("/auth/sync_user called")
        auth_data = await request.json()
        logger.info(f"Auth data from request: {auth_data}")
        user = upsert_user_from_supabase(auth_data)
        logger.info(f"User upserted: {user}")
        if not user:
            logger.error("User upsert failed")
            raise HTTPException(status_code=500, detail="User upsert failed")
        user = serialize_user(user)
        is_first_login = user.pop("is_first_login", False)
        return {"user": user, "is_first_login": is_first_login}
    except Exception as e:
        logger.error(f"Exception in /auth/sync_user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/auth/test")
async def test():
    logger.info("/auth/test called")
    return {"message": "Auth API is up!"}

@router.post("/auth/complete_onboarding")
async def complete_onboarding(current_user: dict = Depends(get_current_user)):
    """
    Mark onboarding as completed for the current user.
    """
    payload = current_user['user']
    provider_id = payload["sub"]
    users = __import__('backend.data_services.mongo.user_repository', fromlist=['get_collection']).get_collection("users")
    user = users.find_one({"auth.provider_id": provider_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    users.update_one({"_id": user["_id"]}, {"$set": {"onboarding_completed": True}})
    return {"success": True}

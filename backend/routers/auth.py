from fastapi import APIRouter, HTTPException, Request, Depends
from backend.data_services.mongo.user_repository import upsert_user_from_supabase
from backend.routers.auth_utils import get_current_user
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()
logger = logging.getLogger("auth")
print("auth router initialized")

@router.post("/auth/register_user")
async def register_user(current_user: dict = Depends(get_current_user)):
    print("register_user called")
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
        user["_id"] = str(user["_id"])
        print("user before pop:", user)
        is_first_login = user.pop("is_first_login", False)
        print("is_first_login:", is_first_login)
        return {"user": user, "is_first_login": is_first_login}
    except Exception as e:
        logger.error(f"Exception in /auth/register_user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/sync_user")
async def sync_user(request: Request):
    print("sync_user called")
    try:
        logger.info("/auth/sync_user called")
        auth_data = await request.json()
        print("auth_data:", auth_data)
        logger.info(f"Auth data from request: {auth_data}")
        user = upsert_user_from_supabase(auth_data)
        logger.info(f"User upserted: {user}")
        if not user:
            logger.error("User upsert failed")
            raise HTTPException(status_code=500, detail="User upsert failed")
        print("user before pop:", user)
        is_first_login = user.pop("is_first_login", False)
        print("is_first_login:", is_first_login)
        return {"user": user, "is_first_login": is_first_login}
    except Exception as e:
        print("Exception in /auth/sync_user:", e)
        logger.error(f"Exception in /auth/sync_user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/auth/test")
async def test():
    logger.info("/auth/test called")
    return {"message": "Auth API is up!"}

from .mongo_client import get_collection
from .utils import to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime

def create_user(user_data: dict):
    users = get_collection("users")
    for k in ["created_at", "updated_at"]:
        if k in user_data:
            user_data[k] = to_datetime(user_data[k])
    user_data["created_at"] = user_data.get("created_at", datetime.utcnow())
    user_data["updated_at"] = datetime.utcnow()
    result = users.insert_one(user_data)
    return users.find_one({"_id": result.inserted_id})

def get_user_by_id(user_id):
    users = get_collection("users")
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return users.find_one({"_id": user_id})

def get_user_by_email(email):
    users = get_collection("users")
    return users.find_one({"email": email})

def update_user(user_id, update_data: dict):
    users = get_collection("users")
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    users.update_one({"_id": user_id}, {"$set": update_data})
    return users.find_one({"_id": user_id})

def delete_user(user_id):
    users = get_collection("users")
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return users.delete_one({"_id": user_id})

def list_users(filter_dict=None, user_id=None, limit=100):
    users = get_collection("users")
    if user_id:
        # Try to find by auth.provider_id (Supabase UUID)
        filter_dict = {"auth.provider_id": user_id}
    else:
        filter_dict = privacy_filter(filter_dict, user_id)
    return list(users.find(filter_dict).limit(limit))

def upsert_user_from_supabase(auth_data: dict):
    """
    Upsert a user in MongoDB from Supabase auth data.
    Tracks first and last login.
    Sets status to 'unverified' on signup, and 'verified' on first login.
    Returns user document and is_first_login flag.
    """
    users = get_collection("users")
    now = datetime.utcnow()
    provider_id = auth_data["id"]
    email = auth_data["email"]
    name = auth_data.get("user_metadata", {}).get("full_name", "")
    # Check if user exists before upsert
    existing_user = users.find_one({"auth.provider_id": provider_id})
    is_first_login = existing_user is None
    update = {
        "$setOnInsert": {
            "created_at": now,
            "status": "unverified"
        },
        "$set": {
            "email": email,
            "name": name,
            "auth": {
                "provider": "supabase",
                "provider_id": provider_id,
                "mfa_enabled": False
            },
            "updated_at": now,
            "last_login": now
        }
    }
    users.update_one({"auth.provider_id": provider_id}, update, upsert=True)
    # If this is the first login (user existed before, but is logging in for the first time), set status to 'verified'
    if not is_first_login and existing_user and existing_user.get("status") == "unverified":
        users.update_one({"auth.provider_id": provider_id}, {"$set": {"status": "verified", "updated_at": now}})
    user = users.find_one({"auth.provider_id": provider_id})
    # If this is the first time the user is created, is_first_login is True
    user["is_first_login"] = is_first_login
    return user 
from .mongo_client import get_collection
from .utils import to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime
from bson.errors import InvalidId
from .business_repository import create_business
from backend.GraphRAG.graphrag.sync import sync_user_to_graph, delete_user_from_graph
import logging

def create_user(user_data: dict):
    users = get_collection("users")
    for k in ["created_at", "updated_at"]:
        if k in user_data:
            user_data[k] = to_datetime(user_data[k])
    user_data["created_at"] = user_data.get("created_at", datetime.utcnow())
    user_data["updated_at"] = datetime.utcnow()
    # Ensure first_name and last_name are present
    if "name" in user_data and ("first_name" not in user_data or "last_name" not in user_data):
        parts = user_data["name"].split()
        user_data["first_name"] = parts[0] if parts else ""
        user_data["last_name"] = " ".join(parts[1:]) if len(parts) > 1 else ""
    result = users.insert_one(user_data)
    user_doc = users.find_one({"_id": result.inserted_id})
    sync_user_to_graph(user_doc)
    return user_doc

def get_user_by_id(user_id):
    print("Getting user by id", user_id)
    users = get_collection("users")
    if isinstance(user_id, str):
        try:
            obj_id = ObjectId(user_id)
            result = users.find_one({"_id": obj_id})
            logging.info(f"[get_user_by_id] Looked up by ObjectId: {user_id} -> {result}")
            return result
        except Exception as e:
            # Not a valid ObjectId, treat as provider_id (UUID)
            result = users.find_one({"auth.provider_id": user_id})
            logging.info(f"[get_user_by_id] Looked up by provider_id: {user_id} -> {result}")
            return result
    result = users.find_one({"_id": user_id})
    logging.info(f"[get_user_by_id] Looked up by _id (non-str): {user_id} -> {result}")
    return result

def get_user_by_email(email):
    users = get_collection("users")
    return users.find_one({"email": email})

def update_user(user_id, update_data: dict):
    users = get_collection("users")
    # Try ObjectId first, fallback to provider_id
    try:
        obj_id = ObjectId(user_id)
        query = {"_id": obj_id}
    except Exception:
        query = {"auth.provider_id": user_id}
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    # If name is present but first_name/last_name are not, split name
    if "name" in update_data and ("first_name" not in update_data or "last_name" not in update_data):
        parts = update_data["name"].split()
        update_data["first_name"] = parts[0] if parts else ""
        update_data["last_name"] = " ".join(parts[1:]) if len(parts) > 1 else ""
    # Only set resume if present
    if "resume" in update_data:
        users.update_one(query, {"$set": {"resume": update_data["resume"], **{k: v for k, v in update_data.items() if k != "resume"}}})
    else:
        users.update_one(query, {"$set": update_data})
    user_doc = users.find_one(query)
    sync_user_to_graph(user_doc)
    return user_doc

def delete_user(user_id):
    users = get_collection("users")
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    result = users.delete_one({"_id": user_id})
    delete_user_from_graph(user_id)
    return result

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
    Handles duplicate email errors by updating existing user if email exists.
    Always includes onboarding_completed (default False if missing).
    """
    users = get_collection("users")
    now = datetime.utcnow()
    provider_id = auth_data["id"]
    email = auth_data["email"]
    name = auth_data.get("user_metadata", {}).get("full_name", "")
    first_name = auth_data.get("user_metadata", {}).get("first_name", "")
    last_name = auth_data.get("user_metadata", {}).get("last_name", "")

    # Try to find by provider_id first
    user = users.find_one({"auth.provider_id": provider_id})
    if not user:
        # If not found, try to find by email
        user = users.find_one({"email": email})
        if user:
            # Update the existing user with the new provider_id and other info
            users.update_one(
                {"_id": user["_id"]},
                {"$set": {
                    "auth.provider_id": provider_id,
                    "auth.provider": "supabase",
                    "email": email,
                    "name": name,
                    "first_name": first_name,
                    "last_name": last_name,
                    "updated_at": now,
                    "last_login": now
                }}
            )
        else:
            # Insert new user with onboarding_completed False
            users.insert_one({
            "email": email,
            "name": name,
                "first_name": first_name,
                "last_name": last_name,
            "auth": {
                "provider": "supabase",
                "provider_id": provider_id,
                "mfa_enabled": False
            },
                "created_at": now,
            "updated_at": now,
                "last_login": now,
                "status": "unverified",
                "onboarding_completed": False
            })
            user = users.find_one({"email": email})
            # Create an empty business for the new user
            if user and user.get("_id"):
                create_business({"user_id": str(user["_id"])})
        user = users.find_one({"email": email})
    else:
        # User found by provider_id
    # If this is the first login (user existed before, but is logging in for the first time), set status to 'verified'
        if user.get("status") == "unverified":
            users.update_one({"_id": user["_id"]}, {"$set": {"status": "verified", "updated_at": now}})
        # Always update last_login and name/email if changed
        users.update_one({"_id": user["_id"]}, {"$set": {"last_login": now, "updated_at": now, "email": email, "name": name,
            "first_name": first_name,
            "last_name": last_name,
        }})
    user = users.find_one({"auth.provider_id": provider_id})

    # Ensure onboarding_completed is always present (default False)
    if "onboarding_completed" not in user:
        users.update_one({"_id": user["_id"]}, {"$set": {"onboarding_completed": False}})
        user["onboarding_completed"] = False

    return user 

def get_user_by_pending_connection():
    users = get_collection("users")
    # Find the most recent user with a PENDING composio_integration
    user = users.find_one(
        {"composio_integrations.status": "PENDING"},
        sort=[("composio_integrations.created_at", -1)]
    )
    if not user:
        return None, None
    # Find the most recent pending integration for this user
    pending = None
    for integ in reversed(user.get("composio_integrations", [])):
        if integ.get("status") == "PENDING":
            pending = integ
            break
    if not pending:
        return None, None
    return user, pending.get("provider") 
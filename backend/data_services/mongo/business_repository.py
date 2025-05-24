from .mongo_client import get_collection
from .utils import to_objectid, to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime

def create_business(business_data: dict):
    businesses = get_collection("businesses")
    if "user_id" in business_data:
        business_data["user_id"] = to_objectid(business_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in business_data:
            business_data[k] = to_datetime(business_data[k])
    business_data["created_at"] = business_data.get("created_at", datetime.utcnow())
    business_data["updated_at"] = datetime.utcnow()
    result = businesses.insert_one(business_data)
    return businesses.find_one({"_id": result.inserted_id})

def get_business_by_id(business_id):
    businesses = get_collection("businesses")
    if isinstance(business_id, str):
        business_id = ObjectId(business_id)
    return businesses.find_one({"_id": business_id})

def update_business(business_id, update_data: dict):
    businesses = get_collection("businesses")
    if isinstance(business_id, str):
        business_id = ObjectId(business_id)
    if "user_id" in update_data:
        update_data["user_id"] = to_objectid(update_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    businesses.update_one({"_id": business_id}, {"$set": update_data})
    return businesses.find_one({"_id": business_id})

def delete_business(business_id):
    businesses = get_collection("businesses")
    if isinstance(business_id, str):
        business_id = ObjectId(business_id)
    return businesses.delete_one({"_id": business_id})

def list_businesses(filter_dict=None, user_id=None, limit=100):
    businesses = get_collection("businesses")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(businesses.find(filter_dict).limit(limit)) 
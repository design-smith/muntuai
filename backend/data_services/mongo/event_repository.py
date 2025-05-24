from .mongo_client import get_collection
from .utils import to_objectid, to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime

def create_event(event_data: dict):
    events = get_collection("events")
    if "user_id" in event_data:
        event_data["user_id"] = to_objectid(event_data["user_id"])
    for k in ["start_time", "created_at", "updated_at"]:
        if k in event_data:
            event_data[k] = to_datetime(event_data[k])
    event_data["created_at"] = event_data.get("created_at", datetime.utcnow())
    event_data["updated_at"] = datetime.utcnow()
    result = events.insert_one(event_data)
    return events.find_one({"_id": result.inserted_id})

def get_event_by_id(event_id):
    events = get_collection("events")
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    return events.find_one({"_id": event_id})

def update_event(event_id, update_data: dict):
    events = get_collection("events")
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    if "user_id" in update_data:
        update_data["user_id"] = to_objectid(update_data["user_id"])
    for k in ["start_time", "created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    events.update_one({"_id": event_id}, {"$set": update_data})
    return events.find_one({"_id": event_id})

def delete_event(event_id):
    events = get_collection("events")
    if isinstance(event_id, str):
        event_id = ObjectId(event_id)
    return events.delete_one({"_id": event_id})

def list_events(filter_dict=None, user_id=None, limit=100):
    events = get_collection("events")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(events.find(filter_dict).limit(limit)) 
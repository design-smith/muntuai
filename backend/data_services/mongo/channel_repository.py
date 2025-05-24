from .mongo_client import get_collection
from bson import ObjectId
from datetime import datetime
from .utils import privacy_filter

def create_channel(channel_data: dict):
    channels = get_collection("channels")
    channel_data["created_at"] = channel_data.get("created_at", datetime.utcnow())
    channel_data["updated_at"] = datetime.utcnow()
    result = channels.insert_one(channel_data)
    return channels.find_one({"_id": result.inserted_id})

def get_channel_by_id(channel_id):
    channels = get_collection("channels")
    if isinstance(channel_id, str):
        channel_id = ObjectId(channel_id)
    return channels.find_one({"_id": channel_id})

def update_channel(channel_id, update_data: dict):
    channels = get_collection("channels")
    if isinstance(channel_id, str):
        channel_id = ObjectId(channel_id)
    update_data["updated_at"] = datetime.utcnow()
    channels.update_one({"_id": channel_id}, {"$set": update_data})
    return channels.find_one({"_id": channel_id})

def delete_channel(channel_id):
    channels = get_collection("channels")
    if isinstance(channel_id, str):
        channel_id = ObjectId(channel_id)
    return channels.delete_one({"_id": channel_id})

def list_channels(filter_dict=None, user_id=None, limit=100):
    channels = get_collection("channels")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(channels.find(filter_dict).limit(limit)) 
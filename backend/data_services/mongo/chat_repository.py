from .mongo_client import get_collection
from .utils import to_objectid, to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime
from backend.GraphRAG.graphrag.sync import sync_chat_to_graph

def create_chat(chat_data: dict):
    chats = get_collection("chats")
    chat_data["created_at"] = chat_data.get("created_at", datetime.utcnow())
    chat_data["updated_at"] = datetime.utcnow()
    result = chats.insert_one(chat_data)
    chat_doc = chats.find_one({"_id": result.inserted_id})
    sync_chat_to_graph(chat_doc)
    return chat_doc

def add_message(chat_id, message: dict):
    chats = get_collection("chats")
    message["created_at"] = message.get("created_at", datetime.utcnow())
    chats.update_one({"_id": ObjectId(chat_id)}, {"$push": {"messages": message}, "$set": {"updated_at": datetime.utcnow()}})
    chat_doc = chats.find_one({"_id": ObjectId(chat_id)})
    sync_chat_to_graph(chat_doc)
    return chat_doc

def list_chats(filter_dict=None, user_id=None, limit=100):
    chats = get_collection("chats")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(chats.find(filter_dict).limit(limit))

def get_chat_by_id(chat_id):
    chats = get_collection("chats")
    return chats.find_one({"_id": ObjectId(chat_id)}) 
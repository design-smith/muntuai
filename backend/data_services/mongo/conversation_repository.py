from .mongo_client import get_collection
from .utils import to_objectid, to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime
from backend.GraphRAG.graphrag.sync import sync_conversation_to_graph, delete_conversation_from_graph

def create_conversation(conversation_data: dict):
    conversations = get_collection("conversations")
    if "user_id" in conversation_data:
        conversation_data["user_id"] = to_objectid(conversation_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in conversation_data:
            conversation_data[k] = to_datetime(conversation_data[k])
    conversation_data["created_at"] = conversation_data.get("created_at", datetime.utcnow())
    conversation_data["updated_at"] = datetime.utcnow()
    result = conversations.insert_one(conversation_data)
    conversation_doc = conversations.find_one({"_id": result.inserted_id})
    sync_conversation_to_graph(conversation_doc)
    return conversation_doc

def get_conversation_by_id(conversation_id):
    conversations = get_collection("conversations")
    if isinstance(conversation_id, str):
        conversation_id = ObjectId(conversation_id)
    return conversations.find_one({"_id": conversation_id})

def update_conversation(conversation_id, update_data: dict):
    conversations = get_collection("conversations")
    if isinstance(conversation_id, str):
        conversation_id = ObjectId(conversation_id)
    if "user_id" in update_data:
        update_data["user_id"] = to_objectid(update_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    conversations.update_one({"_id": conversation_id}, {"$set": update_data})
    conversation_doc = conversations.find_one({"_id": conversation_id})
    sync_conversation_to_graph(conversation_doc)
    return conversation_doc

def delete_conversation(conversation_id):
    conversations = get_collection("conversations")
    if isinstance(conversation_id, str):
        conversation_id = ObjectId(conversation_id)
    result = conversations.delete_one({"_id": conversation_id})
    delete_conversation_from_graph(conversation_id)
    return result

def list_conversations(filter_dict=None, user_id=None, limit=100):
    conversations = get_collection("conversations")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(conversations.find(filter_dict).limit(limit)) 
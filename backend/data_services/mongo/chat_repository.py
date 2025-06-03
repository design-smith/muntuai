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

def add_message(chat_id: str, message: dict) -> dict:
    """Add a message to a chat."""
    chat = get_chat_by_id(chat_id)
    if not chat:
        raise ValueError(f"Chat {chat_id} not found")
    
    # Convert timestamp string to Date object if needed
    created_at = message.get("created_at", datetime.utcnow())
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
    
    # Ensure message has all required fields
    message.update({
        "created_at": created_at,
        "formatted_time": message.get("formatted_time", created_at.strftime("%a, %b %d, %Y %H:%M:%S")),
        "timezone": message.get("timezone", "UTC")
    })
    
    # Add message to chat
    chat["messages"].append(message)
    chat["updated_at"] = datetime.utcnow()
    
    # Update chat in database
    chats_collection = get_collection("chats")
    chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {
            "$push": {"messages": message},
            "$set": {"updated_at": chat["updated_at"]}
        }
    )
    
    return chat

def list_chats(filter_dict=None, user_id=None, limit=100):
    chats = get_collection("chats")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(chats.find(filter_dict).limit(limit))

def get_chat_by_id(chat_id):
    chats = get_collection("chats")
    return chats.find_one({"_id": ObjectId(chat_id)}) 
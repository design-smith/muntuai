from fastapi import APIRouter, HTTPException, Body, Depends
from backend.data_services.mongo.conversation_repository import (
    list_conversations, get_conversation_by_id, create_conversation, update_conversation, delete_conversation
)
from bson import ObjectId
from backend.routers.auth_utils import get_current_user

router = APIRouter()

def to_str_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if doc and "user_id" in doc and isinstance(doc["user_id"], ObjectId):
        doc["user_id"] = str(doc["user_id"])
    return doc

@router.get("/conversations")
def api_list_conversations():
    conversations = list_conversations()
    return {"conversations": [to_str_id(c) for c in conversations]}

@router.get("/conversations/{conversation_id}")
def api_get_conversation(conversation_id: str):
    conversation = get_conversation_by_id(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return to_str_id(conversation)

@router.post("/conversations")
def api_create_conversation(conversation: dict = Body(...)):
    new_conversation = create_conversation(conversation)
    return to_str_id(new_conversation)

@router.put("/conversations/{conversation_id}")
def api_update_conversation(conversation_id: str, update: dict = Body(...)):
    updated = update_conversation(conversation_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return to_str_id(updated)

@router.delete("/conversations/{conversation_id}")
def api_delete_conversation(conversation_id: str):
    result = delete_conversation(conversation_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"deleted": True} 
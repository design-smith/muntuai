from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body
from typing import Dict, List
from backend.agents.primary_agent import get_primary_agent, process_request
import json
from backend.data_services.mongo.chat_repository import create_chat, add_message, list_chats, get_chat_by_id
from bson import ObjectId
from datetime import datetime

router = APIRouter()

# Store active connections, their agents, and conversation history
active_connections: Dict[str, WebSocket] = {}
active_agents: Dict[str, any] = {}
conversation_history: Dict[str, List[dict]] = {}

# Context window settings
MAX_MESSAGES = 20  # Maximum number of messages to keep in context
MAX_CHARS = 4000   # Maximum characters to keep in context

def get_context_messages(history: List[dict]) -> List[dict]:
    """Get messages within the context window based on both message count and character limit."""
    if not history:
        return []
    
    # Start with the most recent messages
    context_messages = history[-MAX_MESSAGES:]
    
    # Calculate total characters
    total_chars = sum(len(msg.get("text", "")) for msg in context_messages)
    
    # If we're over the character limit, remove oldest messages until we're under
    while total_chars > MAX_CHARS and len(context_messages) > 1:
        removed_msg = context_messages.pop(0)
        total_chars -= len(removed_msg.get("text", ""))
    
    return context_messages

@router.websocket("/ws/chat/{chat_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str):
    await websocket.accept()
    chat = get_chat_by_id(chat_id)
    if not chat:
        await websocket.close()
        return
    assistant_id = chat.get('assistant_id')
    user_id = chat.get('user_id')
    messages = chat.get('messages', [])
    # Instantiate the primary agent with the assistant config
    agent = get_primary_agent(assistant_id=assistant_id, user_id=user_id)
    active_connections[chat_id] = websocket
    active_agents[chat_id] = agent
    conversation_history[chat_id] = messages.copy()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            # Add user message to DB and in-memory history
            user_message = {
                "sender": "You",
                "text": message_data["content"],
                "created_at": datetime.utcnow()
            }
            conversation_history[chat_id].append(user_message)
            add_message(chat_id, user_message)
            # Get context messages (convert to role/content for agent)
            # (No longer needed for generate_reply, but keep for possible future use)
            # Append current date and time to the prompt
            # Use process_request to generate the response
            print(f"Processing request: {message_data['content']}")
            print(f"Agent: {agent}")
            print(f"User ID: {user_id}")
            print(f"Assistant ID: {assistant_id}")
            response = process_request(
                agent,
                message_data["content"],
                user_id=user_id,
                assistant_id=assistant_id
            )
            print(f"Response: {response}")
            # Add agent's response to history and DB
            assistant_message = {
                "sender": agent.name,
                "text": response,
                "created_at": datetime.utcnow()
            }
            conversation_history[chat_id].append(assistant_message)
            add_message(chat_id, assistant_message)
            # Send response back to client
            created_at = assistant_message["created_at"]
            await websocket.send_json({
                "type": "message",
                "sender": agent.name,
                "content": response,
                "time": created_at.isoformat() if isinstance(created_at, datetime) else str(created_at)
            })
    except WebSocketDisconnect:
        # Clean up when client disconnects
        if chat_id in active_connections:
            del active_connections[chat_id]
        if chat_id in active_agents:
            del active_agents[chat_id]
        if chat_id in conversation_history:
            del conversation_history[chat_id]
    except Exception as e:
        # Handle any other errors
        await websocket.send_json({
            "type": "error",
            "content": str(e)
        })

def to_str_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if doc and "user_id" in doc and isinstance(doc["user_id"], ObjectId):
        doc["user_id"] = str(doc["user_id"])
    if doc and "assistant_id" in doc and isinstance(doc["assistant_id"], ObjectId):
        doc["assistant_id"] = str(doc["assistant_id"])
    if doc and "messages" in doc:
        for m in doc["messages"]:
            if "_id" in m and isinstance(m["_id"], ObjectId):
                m["_id"] = str(m["_id"])
    return doc

@router.post("/chats")
def api_create_chat(chat: dict = Body(...)):
    # chat must include user_id and assistant_id
    new_chat = create_chat(chat)
    return to_str_id(new_chat)

@router.post("/chats/{chat_id}/messages")
def api_add_message(chat_id: str, message: dict = Body(...)):
    updated_chat = add_message(chat_id, message)
    return to_str_id(updated_chat)

@router.get("/chats")
def api_list_chats(user_id: str = None):
    # Optionally filter by user_id
    chats = list_chats(user_id=user_id) if user_id else list_chats()
    return {"chats": [to_str_id(c) for c in chats]}

@router.get("/chats/{chat_id}")
def api_get_chat(chat_id: str):
    chat = get_chat_by_id(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return to_str_id(chat) 
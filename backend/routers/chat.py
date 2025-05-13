from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from agents.primary_agent import get_primary_agent
import json

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
    total_chars = sum(len(msg.get("content", "")) for msg in context_messages)
    
    # If we're over the character limit, remove oldest messages until we're under
    while total_chars > MAX_CHARS and len(context_messages) > 1:
        removed_msg = context_messages.pop(0)
        total_chars -= len(removed_msg.get("content", ""))
    
    return context_messages

@router.websocket("/ws/chat/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    active_connections[client_id] = websocket
    
    try:
        # Initialize agent for this connection
        agent = get_primary_agent(name="Muntu")
        active_agents[client_id] = agent
        
        # Initialize conversation history for this client
        conversation_history[client_id] = []
        
        # Send welcome message
        welcome_message = {
            "role": "assistant",
            "content": "Hello! I'm Muntu, how can I help you today?",
            "time": "now"
        }
        conversation_history[client_id].append(welcome_message)
        
        await websocket.send_json({
            "type": "message",
            "sender": "Muntu",
            "content": welcome_message["content"],
            "time": "now"
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Add user message to history
            user_message = {
                "role": "user",
                "content": message_data["content"],
                "time": message_data.get("time", "now")
            }
            conversation_history[client_id].append(user_message)
            
            # Get context messages
            context_messages = get_context_messages(conversation_history[client_id])
            
            # Get agent's response
            response = agent.generate_reply(
                messages=context_messages,
                sender=agent
            )
            
            # Add agent's response to history
            assistant_message = {
                "role": "assistant",
                "content": response,
                "time": "now"
            }
            conversation_history[client_id].append(assistant_message)
            
            # Send response back to client
            await websocket.send_json({
                "type": "message",
                "sender": "Muntu",
                "content": response,
                "time": "now"
            })
            
    except WebSocketDisconnect:
        # Clean up when client disconnects
        if client_id in active_connections:
            del active_connections[client_id]
        if client_id in active_agents:
            del active_agents[client_id]
        if client_id in conversation_history:
            del conversation_history[client_id]
    except Exception as e:
        # Handle any other errors
        await websocket.send_json({
            "type": "error",
            "content": str(e)
        }) 
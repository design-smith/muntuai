from backend.GraphRAG.graphrag.db.graph_db import Neo4jWrapper
from datetime import datetime

def sync_user_to_graph(user_doc):
    """
    Create or update a User node in Neo4j based on the MongoDB user document.
    The user's MongoDB _id is used as the Neo4j node id.
    The 'name' field in Neo4j is set to the user's first name from MongoDB.
    The 'last_name' field in Neo4j is set to the user's last name from MongoDB.
    If the user has a 'resume' field (dict), each primitive key/value is added as a property with prefix 'resume_'.
    Only primitive values (str, int, float, bool, or lists of these) are added; nested dicts/lists of dicts are skipped.
    """
    graph_db = Neo4jWrapper()
    node_id = str(user_doc["_id"])
    properties = {
        "id": node_id,
        "name": user_doc.get("first_name", ""),
        "last_name": user_doc.get("last_name", ""),
        "email": user_doc.get("email"),
        "created_at": user_doc.get("created_at").isoformat() if user_doc.get("created_at") else None,
    }
    # Flatten resume fields
    resume = user_doc.get("resume")
    if isinstance(resume, dict):
        for k, v in resume.items():
            # Only add primitive types or lists of primitives
            if isinstance(v, (str, int, float, bool)):
                properties[f"resume_{k}"] = v
            elif isinstance(v, list) and all(isinstance(i, (str, int, float, bool)) for i in v):
                properties[f"resume_{k}"] = v
            # Skip nested dicts or lists of dicts
    # Upsert logic: try to find, else create
    existing = graph_db.get_node("User", {"id": node_id})
    if existing:
        graph_db.update_node("User", {"id": node_id}, properties)
    else:
        graph_db.create_node("User", properties)
    graph_db.close()

def delete_user_from_graph(user_id):
    """
    Delete a User node in Neo4j by user_id (MongoDB _id as string).
    """
    graph_db = Neo4jWrapper()
    graph_db.delete_node("User", {"id": str(user_id)})
    graph_db.close()

# --- BUSINESS ---
def sync_business_to_graph(business_doc):
    graph_db = Neo4jWrapper()
    node_id = str(business_doc["_id"])
    user_id = str(business_doc["user_id"])
    properties = {
        "id": node_id,
        "name": business_doc.get("name"),
        "created_at": business_doc.get("created_at").isoformat() if business_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Organization", {"id": node_id})
    if existing:
        graph_db.update_node("Organization", {"id": node_id}, properties)
    else:
        graph_db.create_node("Organization", properties)
        # Relationship: USER_CONNECTED_TO
        graph_db.create_relationship("User", "Organization", "USER_CONNECTED_TO", {"id": user_id}, {"id": node_id})
    graph_db.close()

def delete_business_from_graph(business_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Organization", {"id": str(business_id)})
    graph_db.close()

# --- CONTACT ---
def sync_contact_to_graph(contact_doc):
    graph_db = Neo4jWrapper()
    node_id = str(contact_doc["_id"])
    user_id = str(contact_doc["user_id"])
    properties = {
        "id": node_id,
        "name": contact_doc.get("name"),
        "email": contact_doc.get("email"),
        "created_at": contact_doc.get("created_at").isoformat() if contact_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Person", {"id": node_id})
    if existing:
        graph_db.update_node("Person", {"id": node_id}, properties)
    else:
        graph_db.create_node("Person", properties)
        # Relationship: USER_KNOWS
        graph_db.create_relationship("User", "Person", "USER_KNOWS", {"id": user_id}, {"id": node_id})
    graph_db.close()

def delete_contact_from_graph(contact_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Person", {"id": str(contact_id)})
    graph_db.close()

# --- CONVERSATION ---
def sync_conversation_to_graph(conversation_doc):
    graph_db = Neo4jWrapper()
    node_id = str(conversation_doc["_id"])
    properties = {
        "id": node_id,
        "status": conversation_doc.get("status"),
        "created_at": conversation_doc.get("created_at").isoformat() if conversation_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Thread", {"id": node_id})
    if existing:
        graph_db.update_node("Thread", {"id": node_id}, properties)
    else:
        graph_db.create_node("Thread", properties)
    graph_db.close()

def delete_conversation_from_graph(conversation_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Thread", {"id": str(conversation_id)})
    graph_db.close()

# --- MESSAGE ---
def sync_message_to_graph(message_doc):
    graph_db = Neo4jWrapper()
    node_id = str(message_doc["_id"])
    conversation_id = str(message_doc.get("conversation_id"))
    sender_id = str(message_doc.get("sender_id", ""))
    # Store content as a string (text) property only
    content = message_doc.get("content")
    if isinstance(content, dict):
        content_str = content.get("text", "")
    else:
        content_str = str(content) if content else ""
    properties = {
        "id": node_id,
        "content": content_str,
        "timestamp": message_doc.get("timestamp").isoformat() if message_doc.get("timestamp") else None,
        "sender_id": sender_id,
        "channel_id": str(message_doc.get("channel_id", "")),
    }
    existing = graph_db.get_node("Message", {"id": node_id})
    if existing:
        graph_db.update_node("Message", {"id": node_id}, properties)
    else:
        graph_db.create_node("Message", properties)
        # Relationship: AUTHORED (User or Person to Message)
        if sender_id:
            graph_db.create_relationship("User", "Message", "AUTHORED", {"id": sender_id}, {"id": node_id})
    graph_db.close()

def delete_message_from_graph(message_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Message", {"id": str(message_id)})
    graph_db.close()

# --- EVENT ---
def sync_event_to_graph(event_doc):
    graph_db = Neo4jWrapper()
    node_id = str(event_doc["_id"])
    user_id = str(event_doc["user_id"])
    properties = {
        "id": node_id,
        "title": event_doc.get("title"),
        "start_time": event_doc.get("start_time").isoformat() if event_doc.get("start_time") else None,
        "created_at": event_doc.get("created_at").isoformat() if event_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Event", {"id": node_id})
    if existing:
        graph_db.update_node("Event", {"id": node_id}, properties)
    else:
        graph_db.create_node("Event", properties)
        # Relationship: USER_PARTICIPATES_IN
        graph_db.create_relationship("User", "Event", "USER_PARTICIPATES_IN", {"id": user_id}, {"id": node_id})
    graph_db.close()

def delete_event_from_graph(event_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Event", {"id": str(event_id)})
    graph_db.close()

# --- CHANNEL ---
def sync_channel_to_graph(channel_doc):
    graph_db = Neo4jWrapper()
    node_id = str(channel_doc["_id"])
    user_id = str(channel_doc.get("user_id", ""))
    properties = {
        "id": node_id,
        "name": channel_doc.get("name"),
        "type": channel_doc.get("type"),
        "created_at": channel_doc.get("created_at").isoformat() if channel_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Channel", {"id": node_id})
    if existing:
        graph_db.update_node("Channel", {"id": node_id}, properties)
    else:
        graph_db.create_node("Channel", properties)
        if user_id:
            graph_db.create_relationship("User", "Channel", "USER_COMMUNICATES_VIA", {"id": user_id}, {"id": node_id})
    graph_db.close()

def delete_channel_from_graph(channel_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Channel", {"id": str(channel_id)})
    graph_db.close()

# --- TASK ---
def sync_task_to_graph(task_doc):
    graph_db = Neo4jWrapper()
    node_id = str(task_doc["_id"])
    user_id = str(task_doc.get("user_id", ""))
    properties = {
        "id": node_id,
        "title": task_doc.get("title"),
        "created_date": task_doc.get("created_at").isoformat() if task_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Task", {"id": node_id})
    if existing:
        graph_db.update_node("Task", {"id": node_id}, properties)
    else:
        graph_db.create_node("Task", properties)
        if user_id:
            graph_db.create_relationship("User", "Task", "USER_MANAGES", {"id": user_id}, {"id": node_id})
    graph_db.close()

def delete_task_from_graph(task_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Task", {"id": str(task_id)})
    graph_db.close()

# --- CHAT ---
def sync_chat_to_graph(chat_doc):
    graph_db = Neo4jWrapper()
    node_id = str(chat_doc["_id"])
    properties = {
        "id": node_id,
        "created_at": chat_doc.get("created_at").isoformat() if chat_doc.get("created_at") else None,
    }
    existing = graph_db.get_node("Thread", {"id": node_id})
    if existing:
        graph_db.update_node("Thread", {"id": node_id}, properties)
    else:
        graph_db.create_node("Thread", properties)
    graph_db.close()

def delete_chat_from_graph(chat_id):
    graph_db = Neo4jWrapper()
    graph_db.delete_node("Thread", {"id": str(chat_id)})
    graph_db.close() 
from .mongo_client import get_collection
from .utils import to_objectid, to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime

def create_contact(contact_data: dict):
    contacts = get_collection("contacts")
    if "user_id" in contact_data:
        contact_data["user_id"] = to_objectid(contact_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in contact_data:
            contact_data[k] = to_datetime(contact_data[k])
    contact_data["created_at"] = contact_data.get("created_at", datetime.utcnow())
    contact_data["updated_at"] = datetime.utcnow()
    result = contacts.insert_one(contact_data)
    return contacts.find_one({"_id": result.inserted_id})

def get_contact_by_id(contact_id):
    contacts = get_collection("contacts")
    if isinstance(contact_id, str):
        contact_id = ObjectId(contact_id)
    return contacts.find_one({"_id": contact_id})

def update_contact(contact_id, update_data: dict):
    contacts = get_collection("contacts")
    if isinstance(contact_id, str):
        contact_id = ObjectId(contact_id)
    if "user_id" in update_data:
        update_data["user_id"] = to_objectid(update_data["user_id"])
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    contacts.update_one({"_id": contact_id}, {"$set": update_data})
    return contacts.find_one({"_id": contact_id})

def delete_contact(contact_id):
    contacts = get_collection("contacts")
    if isinstance(contact_id, str):
        contact_id = ObjectId(contact_id)
    return contacts.delete_one({"_id": contact_id})

def list_contacts(filter_dict=None, user_id=None, limit=100):
    contacts = get_collection("contacts")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(contacts.find(filter_dict).limit(limit)) 
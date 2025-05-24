from .mongo_client import get_collection
from .utils import to_datetime, privacy_filter
from bson import ObjectId
from datetime import datetime

def create_task(task_data: dict):
    tasks = get_collection("tasks")
    for k in ["created_at", "updated_at"]:
        if k in task_data:
            task_data[k] = to_datetime(task_data[k])
    task_data["created_at"] = task_data.get("created_at", datetime.utcnow())
    task_data["updated_at"] = datetime.utcnow()
    result = tasks.insert_one(task_data)
    return tasks.find_one({"_id": result.inserted_id})

def get_task_by_id(task_id):
    tasks = get_collection("tasks")
    if isinstance(task_id, str):
        task_id = ObjectId(task_id)
    return tasks.find_one({"_id": task_id})

def update_task(task_id, update_data: dict):
    tasks = get_collection("tasks")
    if isinstance(task_id, str):
        task_id = ObjectId(task_id)
    for k in ["created_at", "updated_at"]:
        if k in update_data:
            update_data[k] = to_datetime(update_data[k])
    update_data["updated_at"] = datetime.utcnow()
    tasks.update_one({"_id": task_id}, {"$set": update_data})
    return tasks.find_one({"_id": task_id})

def delete_task(task_id):
    tasks = get_collection("tasks")
    if isinstance(task_id, str):
        task_id = ObjectId(task_id)
    return tasks.delete_one({"_id": task_id})

def list_tasks(filter_dict=None, user_id=None, limit=100):
    tasks = get_collection("tasks")
    filter_dict = privacy_filter(filter_dict, user_id)
    return list(tasks.find(filter_dict).limit(limit)) 
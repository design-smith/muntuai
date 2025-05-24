import redis
import pickle
import os
from typing import Any, Optional

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

class RedisCache:
    def __init__(self, host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB):
        self.client = redis.Redis(host=host, port=port, db=db, decode_responses=False)

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        data = pickle.dumps(value)
        if ttl:
            self.client.setex(key, ttl, data)
        else:
            self.client.set(key, data)

    def get(self, key: str) -> Optional[Any]:
        data = self.client.get(key)
        if data is not None:
            return pickle.loads(data)
        return None

    def delete(self, key: str):
        self.client.delete(key)

    def exists(self, key: str) -> bool:
        return self.client.exists(key)

    def flush(self):
        self.client.flushdb() 
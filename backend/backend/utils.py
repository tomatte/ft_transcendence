import redis
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from environs import Env
from datetime import datetime

env = Env()
env.read_env()

from redis.utils import get_lib_version

class MyAsyncWebsocketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    async def send_json(self, data):
        await self.send(json.dumps(data))

class MyRedisClient(redis.StrictRedis):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_json(self, key: str) -> dict | None:
        return json.loads(self.get(key).decode())
        
    def set_json(self, key: str, value: dict):
        return self.set(key, json.dumps(value))
    

redis_host = env("REDIS_HOST")
redis_port = env("REDIS_PORT")
redis_client = MyRedisClient(host=redis_host, port=redis_port, db = 1)

# Disable snapshotting (RDB)
redis_client.config_set('save', '')
# Disable AOF (Append Only File)
redis_client.config_set('appendonly', 'no')


class NotificationState:
    redis = redis_client
    
    @classmethod
    def init_notification_state(cls, id):
        data = cls.redis.get_json(id)
        if not "notifications" in data:
            data["notifications"] = []
            cls.redis.set_json(id, data)
            
    def __init__(self, id) -> None:
        self.id = id
        NotificationState.init_notification_state(id)
            
    def get(self):
        data = NotificationState.redis.get_json(self.id)
        return data["notifications"]
    
    def set(self, value: dict):
        data = NotificationState.redis.get_json(self.id)
        value["time"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data["notifications"].append(value)
        NotificationState.redis.set_json(self.id, data)
    

class UserState:
    redis = redis_client
    
    @classmethod
    def init_user_state(cls, id):
        if not cls.redis.exists(id):
            data = {
                "status": "connected",
            }
            cls.redis.set_json(id, data)
        else:
            data = cls.redis.get_json(id)
            data["status"] = "connected"
            cls.redis.set_json(id, data)
    
    def __init__(self, id) -> None:
        self.id = id
        UserState.init_user_state(id)
        self.notification = NotificationState(id)
    
    def get(self):
        return UserState.redis.get_json(self.id)
    
    def set(self, key, value):
        data = UserState.redis.get_json(self.id)
        data[key] = value
        UserState.redis.set_json(self.id, data)
        
    
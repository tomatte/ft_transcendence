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
        
    async def authenticate(self) -> True | False:
        if self.scope['user'].is_authenticated:
            await self.accept()
            return True

        await self.close()
        return False

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
    def init_notification_state(cls, username):
        data = cls.redis.get_json(username)
        if not "notifications" in data:
            data["notifications"] = []
            cls.redis.set_json(username, data)
            
    def __init__(self, user) -> None:
        self.user = user
        NotificationState.init_notification_state(user.username)
            
    def get(self):
        data = NotificationState.redis.get_json(self.user.username)
        return data["notifications"]
    
    def set(self, value: dict):
        data = NotificationState.redis.get_json(self.user.username)
        value["time"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data["notifications"].append(value)
        NotificationState.redis.set_json(self.user.username, data)
        
class OnlineState:
    redis = redis_client
    
    def __init__(self, user) -> None:
        self.user = user
        self.redis_key = f"online_{user.username}"
        
    def connected(self):
        if OnlineState.redis.exists(self.redis_key):
            self.multi_connection()  
            return 

        data = {
            'id': self.user.id,
            'username': self.user.username,
            'nickname': self.user.nickname,
            'avatar': self.user.avatar.name,
            'connections': 1,
        }
        
        self.set_map(data)
        
    def disconnected(self):
        connections = int(self.get_key('connections'))
    
        if connections == 1:
            OnlineState.redis.delete(self.redis_key)
            return
        
        connections -= 1
        self.set_key('connections', connections)
        
    def multi_connection(self):
        connections = self.get_key('connections')
        connections = int(connections)
        connections += 1
        self.set_key('connections', connections)
    
    def set_key(self, key, value):
        OnlineState.redis.hmset(
            self.redis_key,
            {key: value}
        )
        
    def set_map(self, data: dict):
        OnlineState.redis.hmset(
            self.redis_key,
            data
        )
        
    def get_key(self, key):
        value = OnlineState.redis.hmget(
            self.redis_key,
            key
        )[0]
        
        if key == 'connections':
            return int(value)
        return value.decode()
        
        
    def get_map(self, data: dict):
        data = OnlineState.redis.hgetall(self.redis_key)
        return dict(data)
        
    

class UserState:
    redis = redis_client
    
    @classmethod
    def init_user_state(cls, user):
        if not cls.redis.exists(user.username):
            data = {
                "status": "connected",
            }
            cls.redis.set_json(user.username, data)
        else:
            data = cls.redis.get_json(user.username)
            data["status"] = "connected"
            cls.redis.set_json(user.username, data)
    
    def __init__(self, user) -> None:
        self.user = user
        
        UserState.init_user_state(self.user)
        self.notification = NotificationState(self.user)
        self.online = OnlineState(self.user)
    
    def get(self):
        return UserState.redis.get_json(self.user.username)
    
    def set(self, key, value):
        data = UserState.redis.get_json(self.user.username)
        data[key] = value
        UserState.redis.set_json(self.user.username, data)
        
    
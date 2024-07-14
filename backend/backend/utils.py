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
    
    def get_map_str(self, name: str, key: str):
        value = self.hmget(name, key)[0].decode()
        return value
    
    def set_map_str(self, name: str, key: str, value: str):
        self.hmset(name, { key: value })
    
    def get_map(self, name: str, key: str) -> dict | list:
        data = self.hmget(name, key)[0].decode()
        return json.loads(data)
    
    def set_map(self, name: str, key: str, data: dict | list):
        self.hmset(name, { key: json.dumps(data) })
        
    def get_map_all(self, name: str):
        all_raw = self.hgetall(name)
        
        all = dict()
        
        for key, data_raw in all_raw.items():
            key = key.decode()
            data = json.loads(data_raw.decode())
            all[key] = data
        
        return all
    
    def append_list(self, name: str, key: str, value):
        data = []
        if self.hexists(name, key):
            data: list = self.get_map(name, key)
        
        data.append(value)
        
        self.set_map(
            name,
            key,
            data
        )
        
    def remove_list_item(self, name: str, key: str, value):
        if self.hexists(name, key) == False:
            return

        data: list = self.get_map(name, key)
        data.remove(value)
        
        self.set_map(
            name, 
            key,
            data
        )

redis_host = env("REDIS_HOST")
redis_port = env("REDIS_PORT")
redis_client = MyRedisClient(host=redis_host, port=redis_port, db = 1)

# Disable snapshotting (RDB)
redis_client.config_set('save', '')
# Disable AOF (Append Only File)
redis_client.config_set('appendonly', 'no')


class NotificationState:
    redis = redis_client
    global_channel = "channels_notification"
   
    def __init__(self, user, channel_name) -> None:
        self.user = user
        self.channel_name = channel_name
        self.save_channel_name(channel_name)
        self.init_notification_state(user.username)

    def __del__(self):
        self.redis.remove_list_item(
            self.global_channel, 
            self.user.username,
            self.channel_name
        )
        
            
    def get(self):
        data = NotificationState.redis.get_json(self.user.username)
        return data["notifications"]
    
    def set(self, value: dict):
        data = NotificationState.redis.get_json(self.user.username)
        value["time"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data["notifications"].append(value)
        NotificationState.redis.set_json(self.user.username, data)
        
    def init_notification_state(self, username):
        data = self.redis.get_json(username)
        if not "notifications" in data:
            data["notifications"] = []
            self.redis.set_json(username, data)
        
    def save_channel_name(self, channel_name):
        self.redis.append_list(
            self.global_channel,
            self.user.username,
            channel_name
        )
        
class OnlineState:
    redis = redis_client
    global_name = "global_online_players"
    
    @classmethod
    def get_all(cls):
        return cls.redis.get_map_all(cls.global_name)
    
    @classmethod
    def get_user(cls, username):
        return cls.redis.get_map(cls.global_name, username)
    
    def __init__(self, user) -> None:
        self.user = user
        
    def connected(self):
        if self.redis.hexists(self.global_name, self.user.username):
            self.multi_connection()
            return 
        
        data = {
            'id': self.user.id,
            'username': self.user.username,
            'nickname': self.user.nickname,
            'avatar': self.user.avatar.name,
            'connections': 1,
        }
        
        self.set(data)
        
    def disconnected(self):
        data = self.get()
    
        if data['connections'] == 1:
            self.redis.hdel(self.global_name, self.user.username)
            return

        
        data['connections'] -= 1
        self.set(data)
        
    def multi_connection(self):
        data = self.get()
        data['connections'] += 1
        self.set(data)
    
    def get(self):
        return self.redis.get_map(
            self.global_name,
            self.user.username
        )
        
    def set(self, data: dict):
        self.redis.set_map(
            self.global_name,
            self.user.username,
            data
        )


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
    
    def __init__(self, user, channel_name) -> None:
        self.user = user
        
        UserState.init_user_state(self.user)
        self.notification = NotificationState(self.user, channel_name)
        self.online = OnlineState(self.user)
    
    def get(self):
        return UserState.redis.get_json(self.user.username)
    
    def set(self, key, value):
        data = UserState.redis.get_json(self.user.username)
        data[key] = value
        UserState.redis.set_json(self.user.username, data)
        
    
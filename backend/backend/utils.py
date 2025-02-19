import pytz
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
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
            self.user = self.scope['user']
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
        value = self.hmget(name, key)[0]
        if value != None:
            value = value.decode()
        return value
    
    def set_map_str(self, name: str, key: str, value: str):
        self.hmset(name, { key: value })
    
    def get_map(self, name: str, key: str) -> dict | list | None:
        if self.hexists(name, key) == False:
            return None
        data = self.hmget(name, key)[0].decode()
        return json.loads(data)
    
    def set_map(self, name: str, key: str, data: dict | list):
        self.hmset(name, { key: json.dumps(data) })
        
    def get_map_all(self, name: str):
        all_raw = self.hgetall(name)
        
        all = dict()
        
        for key, data_raw in all_raw.items():
            key = key.decode()
            try:
                data = json.loads(data_raw.decode())
            except json.decoder.JSONDecodeError:
                data = data_raw.decode()
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
        
    def append_list_start(self, name: str, key: str, value):
        data = []
        if self.hexists(name, key):
            data: list = self.get_map(name, key)
        
        data.insert(0, value)
        
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


def get_date_now():
    gmt_minus_3 = pytz.timezone('Etc/GMT+3')
    now_gmt_minus_3 = datetime.now(pytz.utc).astimezone(gmt_minus_3)
    return now_gmt_minus_3.strftime('%d/%m/%y - %H:%M')

class NotificationState:
    redis = redis_client
    channel_notification_key = "channels_notification"
    channel_layer = get_channel_layer()
    
    @classmethod
    async def notify2(cls, username, event):
        await cls.channel_layer.group_send(
            username,
            event
        )
   
    def __init__(self, user, channel_name) -> None:
        self.user = user
        self.channel_name = channel_name
        self.save_channel_name(channel_name)

    def __del__(self):
        self.redis.remove_list_item(
            self.user.username, 
            self.channel_notification_key,
            self.channel_name
        )
        
    def get(self):
        data = self.redis.get_map(self.user.username, 'notifications')
        return  data if data else []
    
    def add(self, value: dict):
        value["time"] = get_date_now()
        self.redis.append_list_start(
            self.user.username,
            'notifications',
            value
        )
        
    def save_channel_name(self, channel_name):
        self.redis.append_list(
            self.user.username,
            self.channel_notification_key,
            channel_name
        )
    
    async def notify(self, username, event):
        await self.channel_layer.group_send(
            username,
            event
        )
        
        
class OnlineState:
    redis = redis_client
    global_name = "global_online_players"
    channel_layer = get_channel_layer()
    
    @classmethod
    async def broadcast_online_players(cls):
        players = cls.get_all()
        
        online_players = {}
        for key, player in players.items():
            if player["connections"] > 0:
                online_players[key] = player
        
        payload = {
            "type": "notification.online_players",
            "players": online_players
        }
        
        await cls.channel_layer.group_send(
            'notification',
            payload
        )
    
    @classmethod
    def get_all(cls):
        return cls.redis.get_map_all(cls.global_name)
    
    @classmethod
    def get_user(cls, username):
        return cls.redis.get_map(cls.global_name, username)
    
    @classmethod
    def get_value(cls, username, key):
        data = cls.get_user(username)
        return data[key] if key in data else None
    
    @classmethod
    def set_user_str(cls, username: str, key: str, value: str):
        data = cls.get_user(username)
        data[key] = value
        cls.redis.set_map(
            cls.global_name,
            username,
            data
        )
    
    
    
    def __init__(self, user) -> None:
        self.user = user
        
    async def connected(self):
        player = self.get()
        if player is not None and player["connections"] >= 1:
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
        await self.broadcast_online_players()
        
    async def disconnected(self):
        data = self.get()
    
        data['connections'] -= 1
        self.set(data)

        if data['connections'] == 0:
            await self.broadcast_online_players()  
        
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
    def  set_value(cls, username, key, value):
        cls.redis.set_map_str(username, key, value)
    
    def __init__(self, user, channel_name) -> None:
        self.user = user
        self.redis.set_map_str(user.username, 'status', 'initiated')
        self.notification = NotificationState(user, channel_name)
        self.online = OnlineState(user)
    
    def get(self, key):
        return self.redis.get_map(self.user.username, key)
    
    def set(self, key, value):
        self.redis.set_map(self.user.username, key, value)
    
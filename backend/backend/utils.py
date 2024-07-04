import redis
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from environs import Env

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
import redis
from environs import Env
import json

env = Env()
env.read_env()

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
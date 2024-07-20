from backend.utils import redis_client as redis
import uuid
from datetime import datetime
from channels.layers import get_channel_layer

class MatchState:
    global_name = "global_matches"
    @classmethod
    def create(cls, type):
        id = str(uuid.uuid4())
        redis.set_map(cls.global_name, id, {
            'phase': 'creating',
            'player_left': "",
            'player_right': "",
            'type': type,
            'created_at': datetime.now().isoformat()
        })
        
    
    @classmethod
    def add_player(cls, match_id, username):
        pass
    
    @classmethod
    def start(cls, match_id):
        pass
    
    @classmethod
    def get_data(cls, match_id):
        pass
    
    @classmethod
    def store_in_users(cls, match_id, username):
        pass
    
    def __init__(self) -> None:
        pass
    
    
    
    
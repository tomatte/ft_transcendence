from backend.utils import redis_client as redis
import uuid
from datetime import datetime
from channels.layers import get_channel_layer

class MatchState:
    @classmethod
    def create(cls):
        id = str(uuid.uuid4())
        redis.set_map(id, {
            'phase': 'creating',
            'player_left': "",
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
    
    def __init__(self) -> None:
        pass
    
    
    
    
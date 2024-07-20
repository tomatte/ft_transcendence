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
            'created_at': datetime.now().isoformat(),
            "match_data": {}
        })
        
        return  id
    
    @classmethod
    def add_player(cls, match_id, username):
        match = cls.get(match_id)
        if match['player_left'] == "":
            match['player_left'] = username
        else:
            match['player_right'] = username
        redis.set_map(cls.global_name, match_id, match)
        
    @classmethod
    def add_players(cls, match_id, left, right):
        match = cls.get(match_id)
        match['player_left'] = left
        match['player_right'] = right
        redis.set_map(cls.global_name, match_id, match)
    
    @classmethod
    def start(cls, match_id):
        match = cls.get(match_id)
        match['phase'] = 'running'
        redis.set_map(cls.global_name, match_id, match)
    
    @classmethod
    def get(cls, match_id):
        return redis.get_map(cls.global_name, match_id)
    
    def __init__(self) -> None:
        pass
    
    
    
    
from backend.utils import redis_client as redis, OnlineState
import uuid
from datetime import datetime
from channels.layers import get_channel_layer
from typing import TypedDict, Dict

class Player(TypedDict):
    username: str
    ready: bool
    x: int
    y: int
    points: int
    result: str

class Ball(TypedDict):
    x: int
    y: int

class MatchData(TypedDict):
    phase: str
    player_left: Player
    player_right: Player
    ball: Ball
    type: type  # Assuming 'type' is meant to be a placeholder for actual type information
    created_at: str

class MatchState:
    global_name = "global_matches"
    @classmethod
    def create(cls, match_type):
        id = str(uuid.uuid4())
        
        match_data: MatchData = {
            'phase': 'creating',
            'player_left': {
                'username': '',
                'ready': False,
                'x': 0,
                'y': 0,
                'points': 0,
                'winner': False,
                "move": 'stop'
            },
            'player_right': {
                'username': '',
                'ready': False,
                'x': 0,
                'y': 0,
                'points': 0,
                'winner': False,
                "move": 'stop'
            },
            "ball": {
                'x': 0,
                'y': 0,
                'bounced': False
            },
            'match_type': match_type,
            'created_at': datetime.now().isoformat(),
        }
        
        redis.set_map(cls.global_name, id, match_data)
        return  id
    
    @classmethod
    def add_player(cls, match_id, username):
        match: MatchData = cls.get(match_id)
        if match['player_left']['username'] == '':
            match['player_left']['username'] = username
        else:
            match['player_right']['username'] = username
        redis.set_map(cls.global_name, match_id, match)
        redis.set_map_str(username, "match_id", match_id)
        
    @classmethod
    def add_players(cls, match_id, user_left, user_right):
        match: MatchData = cls.get(match_id)
        match['player_left']['username'] = user_left
        match['player_right']['username'] = user_right
        redis.set_map(cls.global_name, match_id, match)
        redis.set_map_str(user_left, "match_id", match_id)
        redis.set_map_str(user_right, "match_id", match_id)
    
    @classmethod
    def start(cls, match_id):
        match: MatchData = cls.get(match_id)
        match['phase'] = 'start'
        redis.set_map(cls.global_name, match_id, match)
    
    @classmethod
    def get(cls, match_id):
        return redis.get_map(cls.global_name, match_id)
    
    @classmethod
    def ready(cls, match_id, username):
        match: MatchData = cls.get(match_id)
        if match['player_left']['username'] == username:
            match['player_left']['ready'] = True
        else:
            match['player_right']['ready'] = True
        redis.set_map(cls.global_name, match_id, match)
        
    @classmethod
    def set(cls, match_id, match):
        return redis.set_map("global_matches", match_id, match)
    
    @classmethod
    def filter_winner(cls, match_data):
        if match_data["phase"] != "ended":
            return None
        return (
            match_data['player_left']
            if match_data['player_left']['points'] > match_data['player_right']['points']
            else match_data['player_right']
        )
        
    @classmethod
    def filter_loser(cls, match_data):
        return (
            match_data['player_left']
            if match_data['player_left']['points'] < match_data['player_right']['points']
            else match_data['player_right']
        )
    
    def __init__(self) -> None:
        pass
    
    
    
    
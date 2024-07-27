from backend.utils import redis_client
from .match_state import MatchState
from .tournament_state import TournamentState
from typing import List, Tuple

class PlayerRedis:
    def __init__(self, data):
        self.username: str = data['username']
        self.ready: bool = data['ready']
        self.x: int = data['x']
        self.y: int = data['y']
        self.points: int = data['points']
        self.winner: bool = data['winner']
        self.move: str = data['move']
        
class BallRedis:
    def __init__(self, data):
        self.x: int = data['x']
        self.y: int = data['y']
        self.bounced: bool = data['bounced']

class MatchRedis:
    def __init__(self, id):
        data = MatchState.get(id)
        self.phase:str = data['phase']
        self.player_left = PlayerRedis(data['player_left'])
        self.player_right = PlayerRedis(data['player_right'])
        self.ball = BallRedis(data['ball'])
        self.match_type:str = data['match_type']
        self.created_at:str = data['created_at']

class TournamentRedis:
    def __init__(self, id):
        data = TournamentState.get(id)
        self.players: List[str] = data['players']
        self.id:str = data['id']
        self.date:str = data['date']
        self.status:str = data['status']
        self.final_bracket_event_sent:int = data['final_bracket_event_sent']
        self.final = data['final']
        self.semi_finals = (
            MatchRedis(data['semi_finals'][0]),
            MatchRedis(data['semi_finals'][1])
        )
        self.final = MatchRedis(data['final'])
        
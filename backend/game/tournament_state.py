from backend.utils import redis_client as redis
import uuid
from datetime import datetime
from enum import Enum

class TournamentState:
    global_name = 'global_tournament'
    
    def __init__(self, user) -> None:
        self.user = user
        pass
    
    def create(self):
        self.tournament_id = str(uuid.uuid4())
        
        payload = {
            'players': [self.user.username],
            'id': self.tournament_id,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'phase': 'CREATING'
        }
        
        redis.set_map(
            self.global_name,
            self.tournament_id,
            payload
        )
        
        return self.tournament_id
    
    def join(self, tournament_id):
        print(f"{self.user.username} JOINED a Tournament")
        pass
    
    def exit(self):
        pass
    
    
from backend.utils import redis_client as redis

class TournamentState:
    def __init__(self, user) -> None:
        print(f"TournamentState created by: {user.username}")
        pass
    
    def create(self):
        pass
    
    def enter(self, tournament_id):
        pass
    
    def exit(self):
        pass
    
    
from backend.utils import redis_client, OnlineState
from .my_types import *
from .tournament_state import TournamentState

class ClientPayloadError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class _JoinTournamentValiadation:
    def __init__(self, parent) -> None:
        self.parent = parent
    
    def validate_data(self, data: dict):
        if not isinstance(data, dict):
            raise TypeError("data must be dict")
        
        if not "tournament" in data:
            raise  ClientPayloadError("no tournament data found")
        if not "id" in data["tournament"]:
            raise  ClientPayloadError("no tournament id found")
        
    def can_join(self, data):
        try:
            if hasattr(self.parent, "tournament_id"):
                print("join fail: hasattr tournament_id")
                return False
            if redis_client.hexists(self.parent.user.username, 'tournament_id'):
                print("join fail: hexists tournament_id")
                return False
            
            tournament_players = TournamentState.get_players(data["tournament"]["id"])
            if len(tournament_players) == 4:
                print("join fail: len tournament_players ==  4")
                return False
            for player in tournament_players:
                if player["username"] == self.parent.user.username:
                    print("join fail: user already in tournament")
                    return False
            return True
        except Exception as e:
            print("join fail: exception")
            print(e)
            return False
        
        

        
# TOURNAMENT VALIDATIONS
class TournamentValidation:
    def __init__(self, parent) -> None:
        self.join_tournament = _JoinTournamentValiadation(parent)
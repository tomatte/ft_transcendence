from backend.utils import redis_client
from .my_types import *

class ClientPayloadError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class _JoinTournamentValiadation:
    def __init__(self, parent) -> None:
        self.parent = parent
    
    def validate_data(self, data: dict):
        if not isinstance(data, dict):
            raise TypeError("data must be dict")
        
        if not "tournament_id" in data:
            raise  ClientPayloadError("no tournament_id found")
        if not "player_id" in data:
            raise  ClientPayloadError("no player_id found")
        
    def can_join(self, data):
        try:
            if hasattr(self.parent, "tournament_id"):
                return False
            tournament_id = data["tournament_id"]
            tournament_data: TournamentData = redis_client.get_json(tournament_id)
            if len(tournament_data["players"]) == 4:
                return False
            for player_id in tournament_data["players"]:
                if player_id == data["player_id"]:
                    return False
            return True
        except:
            return False
        
        

        
# TOURNAMENT VALIDATIONS
class TournamentValidation:
    def __init__(self, parent) -> None:
        self.join_tournament = _JoinTournamentValiadation(parent)
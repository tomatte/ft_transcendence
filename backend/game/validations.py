from backend.utils import redis_client

class ClientPayloadError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class _JoinTournamentValiadation:
    def __init__(self, parent) -> None:
        self.parent = parent
    
    def validateData(self, data: dict):
        if not isinstance(data, dict):
            raise TypeError("data must be dict")
        
        if not "tournament_id" in data:
            raise  ClientPayloadError("no tournament_id found")
        if not "player_id" in data:
            raise  ClientPayloadError("no player_id found")
        
# TOURNAMENT VALIDATIONS
class TournamentValidation:
    def __init__(self, parent) -> None:
        self.joinTournament = _JoinTournamentValiadation(parent)
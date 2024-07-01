from backend.utils import redis_client

class InvalidClientPayload(Exception):
    def __init__(self) -> None:
        super().__init__("invalid client payload")

def validation_for_join_tournament(data):
    has_tournament_id = "tournament_id" in data
    has_player_id = "player_id" in data
    if not has_player_id or not has_tournament_id:
        raise  InvalidClientPayload()
    
    tournament_data = redis_client.get(self.tournament_id).decode()
    if not tournament_data:
        #TODO: send error message to client
        return
    tournament_data = json.loads(tournament_data)
    
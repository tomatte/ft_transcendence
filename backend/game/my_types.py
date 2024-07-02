from typing import TypedDict, Dict, List

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: str
    match_id: str
    action: str

class PlayerDataType(TypedDict):
    x: float
    y: float
    pos: str
    points: int
    
class BallDataType(TypedDict):
    x: float
    y: float

PlayersData = Dict[str, PlayerDataType]

class MatchData(TypedDict):
    ball: BallDataType
    players: PlayersData
    
class TournamentData(TypedDict):
    players: List[str]
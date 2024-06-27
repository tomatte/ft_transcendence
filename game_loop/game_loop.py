import asyncio
import websockets
import json
from pong_entities import *
from typing import TypedDict

PLAYER_HEIGHT = 100
PLAYER_WIDTH = 40
PLAYER_SPEED = 600
BALL_RADIOUS = 10
BALL_SPEED = 400
BALL_START_DIRECTION = 30

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: int
    match_id: int
    action: str

class Socket:
    uri = "ws://localhost:8000/game_loop/"
    ws: websockets.WebSocketClientProtocol = None
    
    @classmethod
    async def  connect_to_server(cls):
        cls.ws = await websockets.connect(cls.uri)
        print("connected to server")

    @classmethod
    async def send_info(cls):
        while True:
            if len(Game.payload) > 0:
                await cls.ws.send(json.dumps(Game.payload))
            await asyncio.sleep(Game.fps_time)
            
    @classmethod
    async def rcve_info(cls):
        while True:
            try:
                msg = await Socket.ws.recv()
                data: dict = json.loads(msg)
                print(f"data -> {data}")
                Actions.act(data)
                data.clear()
                msg = ""
            except Exception as e:
                print(f"An error occurred: {e}")

class Game:
    balls: List[Ball] = []
    fps_time = 1 / FPS
    payload = {}
    matches: List['Match'] = []

    @classmethod
    def move_balls(cls):
        for ball in cls.balls:
            ball.move(FPS)
    @classmethod
    def create_payload(cls):
        cls.payload.clear()
        for match in cls.matches:
            if match.started == False:
                continue
            cls.payload[match.id] = {
                "ball": {
                    "x": match.ball.x,
                    "y": match.ball.y
                    },
                "players": {
                    match.player_left.id: {
                        "x": match.player_left.x,
                        "y": match.player_left.y,
                        "pos": "left",
                        "points": match.player_right.hits
                    },
                    match.player_right.id: {
                        "x": match.player_right.x,
                        "y": match.player_right.y,
                        "pos": "right",
                        "points": match.player_left.hits
                    }
                }
            }
            
        
class Match:
    players: dict[int, Player] = dict()
    balls: List[Ball] = []
    matches = {}
    
    def __init__(self, data) -> None:
        self.started = False
        self.id = data["match_id"]
        Match.matches[self.id] = self
        
        self.player_left = Player(
            [0, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_LEFT,
            data["player_id"]
        )
        Match.players[self.player_left.id] = self.player_left
        self.player_left.match_id = self.id
        
        self.ball = Ball(
            [TABLE_WIDTH / 2, TABLE_HEIGHT / 2], 
            BALL_RADIOUS, 
            BALL_SPEED, 
            BALL_START_DIRECTION,
            self.id
        )
        
        self.ball.players["left"] = self.player_left
        Match.balls.append(self.ball)
        
        
        
    def add_player_right(self, data):
        self.player_right = Player(
            [TABLE_WIDTH, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_RIGHT,
            data["player_id"]
        )
        Match.players[self.player_right.id] = self.player_right
        self.player_right.match_id = self.id
        self.ball.players["right"] = self.player_right
    
    def start_match(self):
        Game.balls.append(self.ball)
        self.started = True
        
    @classmethod
    def find_match(cls, match_id):
        for id, match in cls.matches.items():
            if id == match_id:
                return match
        return None
    
    @classmethod
    def move_players(cls):
        for id, player in cls.players.items():
            if player.movement == "up":
                player.move_up()
            elif player.movement == "down":
                player.move_down()
        

class Actions:
    @classmethod
    def new_match(cls, data):
        print("new_match()")
        match = Match(data)
        Game.matches.append(match)
        print(f"ball: x:{match.ball.x} y:{match.ball.y}")
        print(f"player_left: x:{match.player_left.x} y:{match.player_left.y}")
    
    @classmethod
    def player_move(cls, data: PlayerMoveDataType):
        player = Match.players[data["player_id"]]
        player.movement = data["key"]
        
    @classmethod
    def player_connect(cls, data):
        match = Match.find_match(data["match_id"])
        if not isinstance(match, Match):
            cls.new_match(data)
            return
        match.add_player_right(data)
        match.start_match()
    
    @classmethod
    def match_end(cls, data):
        pass
    
    @classmethod
    def act(cls, data):
        if data["action"] == "new_match":
            cls.new_match(data)
            return 
        if data["action"] == "player_connect":
            cls.player_connect(data)
            return 
        if data["action"] == "player_move":
            cls.player_move(data)
            return 


async def main():
    try:
        await Socket.connect_to_server()
    except:
        print("failed to connect to server, exited.")
        exit(1)
        
    asyncio.create_task(Socket.send_info())
    asyncio.create_task(Socket.rcve_info())
    while True:
        Game.move_balls()
        Match.move_players()
        Game.create_payload()
        
        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
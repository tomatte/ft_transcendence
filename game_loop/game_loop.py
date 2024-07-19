import asyncio
from websockets.exceptions import ConnectionClosed
import websockets
import json
from pong_entities import *
from typing import TypedDict
from environs import Env
env = Env()
env.read_env()

PLAYER_HEIGHT = 100
PLAYER_WIDTH = 40
PLAYER_SPEED = 600
BALL_RADIOUS = 10
BALL_SPEED = 400
BALL_START_DIRECTION = 30

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: str
    match_id: str
    action: str

class Socket:
    uri = f"ws://{env("BACKEND_HOST")}:{env("BACKEND_PORT")}/ws/game_loop/"
    ws: websockets.WebSocketClientProtocol = None
    
    @classmethod
    async def  connect_to_server(cls):
        while True:
            try:
                print("trying to connect to server")
                cls.ws = await websockets.connect(cls.uri)
                print("connected successfuly!!!")
                return
            except:
                await asyncio.sleep(2)
        raise ConnectionError("failed to connect with backend")

    @classmethod
    async def send_info(cls):
        while True:
            if len(Game.payload) > 0:
                try:
                    await cls.ws.send(json.dumps(Game.payload))
                except:
                    await cls.connect_to_server()
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
            except ConnectionClosed:
                await cls.connect_to_server()
            except Exception as e:
                print(f"An error occurred: {e}")
                await asyncio.sleep(1)

class Game:
    balls: dict[int, Ball] = dict()
    fps_time = 1 / FPS
    payload = {}

    @classmethod
    def move_balls(cls):
        for id, ball in cls.balls.items():
            ball.move(FPS)
    @classmethod
    def create_payload(cls):
        cls.payload.clear()
        for match_id, match in Match.matches.items():
            if match.started == False:
                continue
            cls.payload[match_id] = {
                "ball": {
                    "x": match.ball.x,
                    "y": match.ball.y,
                    "bounced": match.ball.bounced
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
                },
                "action": match.action
            }
            
        
class Match:
    players: dict[int, Player] = dict()
    balls: dict[int, Ball] = dict()
    matches: dict[int, 'Match'] = dict()
    
    def __init__(self, data) -> None:
        self.started = False
        self.id = data["match_id"]
        self.max_scores = data["max_scores"]
        self.action = "coordinates"
        Match.matches[self.id] = self
        
        self.player_right: Player | None = None
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
        Match.balls[self.id] = self.ball
        
        
        
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
        Game.balls[self.id] = self.ball
        self.started = True
        
    def destroy(self):
        Match.matches.pop(self.id, None)
        Match.balls.pop(self.id, None)
        Match.players.pop(self.player_left.id, None)
        Match.players.pop(self.player_right.id, None)
        Game.balls.pop(self.id, None)
        
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
                
    @classmethod
    def verify_ended_matches(cls):
        for match_id, match in cls.matches.items():
            if match.player_right is None:
                continue
            total_scores = match.player_left.hits + match.player_right.hits
            if total_scores >= match.max_scores:
                match.action = "match_end"
                
    @classmethod
    def destroy_matches(cls):
        for match in list(cls.matches.values()):
            if match.action != "match_end":
                continue
            match.destroy()

class Actions:
    @classmethod
    def new_match(cls, data):
        print("new_match()")
        match = Match(data)
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
    await Socket.connect_to_server()
        
    asyncio.create_task(Socket.send_info())
    asyncio.create_task(Socket.rcve_info())
    while True:
        Game.move_balls()
        Match.move_players()
        Match.verify_ended_matches()
        Game.create_payload()
        Match.destroy_matches()

        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
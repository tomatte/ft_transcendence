import asyncio
import websockets
import json
from pong_entities import *

PLAYER_HEIGHT = 100
PLAYER_WIDTH = 20
PLAYER_SPEED = 900

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
        for ball in cls.balls:
            cls.payload[ball.match_id] = (ball.x, ball.y)
            
        
class Match:
    players: dict[int, Player] = dict()
    balls: List[Ball] = []
    
    def __init__(self, data) -> None:
        
        self.id = data["match_id"]
        
        self.player_left = Player(
            [0, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_LEFT,
            data["player_id"]
        )
        Match.players[self.player_left.id] = self.player_left
        
        self.ball = Ball(
            [TABLE_WIDTH / 2, TABLE_HEIGHT / 2], 
            30, 
            900, 
            360,
            self.id
        )
        self.ball.players.append(self.player_left)
        self.ball.players.append(Player([1500, 1500], 0, 10, 10, Entity.PLAYER_RIGHT, 9))
        Match.balls.append(self.ball)
        
        
    def add_player_right(self, data):
        pass
    
    def start_match(self):
        Game.balls.append(self.ball)
        

class Actions:
    @classmethod
    def new_match(cls, data):
        print("new_match()")
        Game.matches.append(Match(data))
        Game.matches[0].start_match()
        print(data)
        # print(f"ball: x:{match.ball.x} y:{match.ball.y}")
        # print(f"player_left: x:{match.player_left.x} y:{match.player_left.y}")
    
    @classmethod
    def player_move(cls, data):
        player = Match.players[data["player_id"]]
        if data["direction"] == "Up":
            player.move_up()
        else:
            player.move_down()
        print(f"player -> x:{player.x} y:{player.y}")
        ball = Game.balls[0]
    
    @classmethod
    def player_disconnect(cls, data):
        pass
    
    @classmethod
    def act(cls, data):
        if data["action"] == "new_match":
            cls.new_match(data)
            return 
        if data["action"] == "new_player":
            cls.new_player(data)
            return 
        if data["action"] == "player_move":
            cls.player_move(data)
            return 
        if data["action"] == "player_disconnect":
            cls.player_disconnect(data)
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
        Game.create_payload()
        
        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
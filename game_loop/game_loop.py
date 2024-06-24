import asyncio
import websockets
import json
from pong_entities import *

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
                data = json.loads(msg)
                print(f"data -> {data}")
                Actions.act(data)
            except:
                pass

class Game:
    balls: List[Ball] = []
    fps_time = 1 / FPS
    payload = {}

    @classmethod
    def move_balls(cls):
        for ball in cls.balls:
            ball.move(FPS)
    @classmethod
    def create_payload(cls):
        cls.payload.clear()
        for ball in cls.balls:
            cls.payload[ball.id] = (ball.x, ball.y)
            
    @classmethod
    def create_ball():
        players = [
            Player([0, 0], 900, 20, 100, Entity.PLAYER_LEFT),
            Player([0, 0], 900, 20, 100, Entity.PLAYER_LEFT)
        ]
        ball = Ball([630, 350], 10, 500, 30, 1)
        ball.set_players(players)
        Game.balls.append(ball)


class Actions:
    @classmethod
    def new_game(cls, data):
        pass
    
    @classmethod
    def new_player(cls, data):
        pass
    
    @classmethod
    def player_move(cls, data):
        pass
    
    @classmethod
    def player_disconnect(cls, data):
        pass
    
    @classmethod
    def act(cls, data):
        if data["action"] == "new_game":
            cls.new_game(data)
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
import asyncio
import websockets
import json
from pong_entities import *

class Game:
    uri = "ws://localhost:8000/game_loop/"
    balls: List[Ball] = []
    fps_time = 1 / FPS
    websocket: websockets.WebSocketClientProtocol = None
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

players = [
    Player([0, 0], -1, 20, 100, Entity.PLAYER_LEFT),
    Player([0, 0], -1, 20, 100, Entity.PLAYER_LEFT)
]
ball = Ball([630, 350], 10, 500, 30, 1)
ball.set_players(players)
Game.balls.append(ball)


async def  connect_to_server():
    Game.websocket = await websockets.connect(Game.uri)
    print("connected to server")

async def send_info():
    while True:
        await Game.websocket.send(json.dumps(Game.payload))
        await asyncio.sleep(Game.fps_time)
        
async def rcve_info():
    while True:
        msg = await Game.websocket.recv()
        print(msg)
        
        


async def main():
    await connect_to_server()

    asyncio.create_task(send_info())
    asyncio.create_task(rcve_info())
    while True:
        Game.move_balls()
        Game.create_payload()
        
        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
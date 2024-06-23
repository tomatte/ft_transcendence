import asyncio
import websockets
import json
from pong_entities import *

class Game:
    uri = "ws://localhost:8000/britney/"  # Replace with your WebSocket server URL
    ball = Ball([630, 350], 10, 500, 30)
    ball.set_players([Player([0,0], 500, 20, 100, Entity.PLAYER_LEFT)])
    fps_time = 1 / 30
    websocket: websockets.WebSocketClientProtocol = None

    @classmethod
    def init(cls):
        cls.payload = {
            "coordinates": (cls.ball.x, cls.ball.y),
            "entity": "ball"
        }

Game.init()

async def  connect_to_server():
    Game.websocket = await websockets.connect(Game.uri)
    print("connected to server")

async def communication():
    while True:
        await Game.websocket.send(json.dumps(Game.payload))
        message = await Game.websocket.recv()
        print(message)
        await asyncio.sleep(Game.fps_time)
        
        


async def main():
    await connect_to_server()

    asyncio.create_task(communication())
    while True:
        Game.ball.move(30)
        
        Game.payload["coordinates"] = (Game.ball.x, Game.ball.y)
        Game.payload["entity"] = "ball"
        
        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
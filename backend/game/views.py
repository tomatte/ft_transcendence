from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, List

class GameLoopConsumer(AsyncWebsocketConsumer):
    clients = []
    game_loop_client = None
    
    @classmethod
    def add_client(cls, client):
        cls.clients.append(client)
        
    @classmethod
    async def send_player_data(cls, payload):
        if len(cls.clients) < 1:
            return
        print("send player data")
        await cls.game_loop_client.send(json.dumps(payload))
    
    async def connect(self):
        await self.accept()
        GameLoopConsumer.game_loop_client = self

    
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        pos = data["1"]
        payload = {
            "position": [pos[0] - 10, pos[1] - 10],
            "action": "ball",
            "method": "ball"
        }
        await GameLoopConsumer.clients[0].send(json.dumps(payload))
    
    async def disconnect(self, code):
        GameLoopConsumer.clients.clear()
        return await super().disconnect(code)
    

# Create your views here.
class PlayerConsumer(AsyncWebsocketConsumer):
    index = 0
    players: Dict[int, Player] = {}
    async def connect(self):
        await self.accept()
        
        PlayerConsumer.index += 1
        self.id = PlayerConsumer.index

        payload = {
			"method": "connect",
            "action": "new_match",
            "position": (0, 300),
            "match_id": 1,
            "player_id": self.id
		}
        
        GameLoopConsumer.add_client(self)
        await GameLoopConsumer.send_player_data(payload)
        await self.send(json.dumps(payload))

    async def disconnect(self, close_code):
        print(f"close_code: {close_code}")
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        
        payload = {"method": "receive"}
        
        if data["key"] == "Up":
            payload["action"] = f"player {data["id"]} moved up!"
            payload["position"] = (0, 350)
            await self.send(json.dumps(payload))
        elif data["key"] == "Down":
            payload["position"] = (0, 350)
            payload["action"] = f"player {data["id"]} moved down!"
        else:
            return
        
        game_loop_payload = {
            "action": "player_move",
            "direction": data["key"],
            "match_id": 1,
            "player_id": data["id"]
		}

        await GameLoopConsumer.send_player_data(game_loop_payload)    
        await self.send(json.dumps(payload))
        
            
from django.shortcuts import render
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, List

class GameLoopConsumer(AsyncWebsocketConsumer):
    clients = []
    
    @classmethod
    def add_client(cls, client):
        cls.clients.append(client)
        
    @classmethod
    async def send_player_data(cls, data):
        if len(cls.clients) < 1:
            return
        print("send player data")
        await cls.clients[0].send(data)
    
    async def connect(self):
        await self.accept()
        GameLoopConsumer.add_client(self)

    
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        await self.send("hello bitch")
    
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
        new_player = Player(
            [0, 360], 
            900, 
            20, 
            100, 
            Entity.PLAYER_RIGHT if PlayerConsumer.index % 2 == 0 else Entity.PLAYER_LEFT
        )
        
        PlayerConsumer.players[PlayerConsumer.index] = new_player
        
        payload = {
			"id": PlayerConsumer.index,
			"method": "connect",
            "position": (new_player.x, new_player.y - new_player.height / 2),
		}

        await self.send(json.dumps(payload))

    async def disconnect(self, close_code):
        print(f"close_code: {close_code}")
        pass

    async def receive(self, text_data):
        await GameLoopConsumer.send_player_data(text_data)
        data = json.loads(text_data)
        
        player = PlayerConsumer.players[data["id"]]
        payload = {"method": "receive"}
        
        if data["key"] == "Up":
            player.move_up()
            payload["action"] = f"player {data["id"]} moved up!"
            payload["position"] = (player.x, player.y - player.height / 2)
            await self.send(json.dumps(payload))
        elif data["key"] == "Down":
            player.move_down()
            payload["position"] = (player.x, player.y - player.height / 2)
            payload["action"] = f"player {data["id"]} moved down!"
            await self.send(json.dumps(payload))
            
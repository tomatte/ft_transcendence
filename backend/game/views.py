from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict


# Create your views here.
class XablauConsumer(AsyncWebsocketConsumer):
    index = 0
    players: Dict[int, Player] = {}
    async def connect(self):
        await self.accept()
        
        XablauConsumer.index += 1
        self.id = XablauConsumer.index
        new_player = Player(
            [0, 360], 
            900, 
            20, 
            100, 
            Entity.PLAYER_RIGHT if XablauConsumer.index % 2 == 0 else Entity.PLAYER_LEFT
        )
        
        XablauConsumer.players[XablauConsumer.index] = new_player
        
        payload = {
			"id": XablauConsumer.index,
			"method": "connect",
            "position": (new_player.x, new_player.y - new_player.height / 2),
		}

        await self.send(json.dumps(payload))

    async def disconnect(self, close_code):
        print(f"close_code: {close_code}")
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        player = XablauConsumer.players[data["id"]]
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
            
class Britney(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        await self.send("hello bitch")
    
    async def disconnect(self, code):
        return await super().disconnect(code)
    
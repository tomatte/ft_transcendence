from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import Player, Entity
from typing import Dict


# Create your views here.
class XablauConsumer(AsyncWebsocketConsumer):
    index = 0
    players: Dict[int, Player] = {}
    async def connect(self):
        await self.accept()
        
        XablauConsumer.index += 1
        new_player = Player(
            [0, 360], 
            500, 
            20, 
            100, 
            Entity.PLAYER_LEFT if XablauConsumer.index % 2 == 0 else Entity.PLAYER_RIGHT
        )
        
        XablauConsumer.players[XablauConsumer.index] = new_player
        
        payload = {
			"id": XablauConsumer.index,
			"method": "connect",
            "position": (new_player.x, new_player.y),
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
            player.y -= 5
            payload["action"] = f"player {data["id"]} moved up!"
            payload["position"] = (player.x, player.y)
            await self.send(json.dumps(payload))
        elif data["key"] == "Down":
            player.y += 5
            payload["position"] = (player.x, player.y)
            payload["action"] = f"player {data["id"]} moved down!"
            await self.send(json.dumps(payload))
	
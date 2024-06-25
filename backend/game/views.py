from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, List

class GameLoopConsumer(AsyncWebsocketConsumer):
    game_loop_client = None
    
    @classmethod
    async def send_to_game_loop(cls, payload):
        if cls.game_loop_client == None:
            print("no game_loop connected")
            return

        print("send data to game_loop")
        print(payload)
        await cls.game_loop_client.send(json.dumps(payload))
    
    async def connect(self):
        await self.accept()
        GameLoopConsumer.game_loop_client = self

    
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        temp_match_id = "1"
        temp_player_id = "1"
        payload = {
            "player": data[temp_match_id]["players"][temp_player_id],
            "ball": data[temp_match_id]["ball"],
            "action": "coordinates",
            "method": "coordinates"
        }
    
    async def disconnect(self, code):
        GameLoopConsumer.clients.clear()
        return await super().disconnect(code)
    

# Create your views here.
class PlayerConsumer(AsyncWebsocketConsumer):
    players = {}
    
    @classmethod
    def show_players(cls):
        print("show_players():")
        for key, value in cls.players.items():
            print(f"{key} -> {value}")
    
    async def connect(self):
        await self.accept()

        payload = {
            "action": "connect",
            "match_id": 1,
		}
        
        await self.send(json.dumps(payload))

    async def disconnect(self, close_code):
        print(f"close_code: {close_code}")
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        if data["action"] == "ready":
            PlayerConsumer.players[data["player_id"]] = {
                "client": self,
                "player_id": data["player_id"],
                "match_id": data["match_id"]
            }
            PlayerConsumer.show_players()
            
            payload = {
                "action": "player_connect",
                "player_id": data["player_id"],
                "match_id": data["match_id"]
            }
            await GameLoopConsumer.send_to_game_loop(payload)
            return
         
        return 
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
        
            
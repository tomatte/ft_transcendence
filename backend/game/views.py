from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, TypedDict

class PlayerDataType(TypedDict):
    x: float
    y: float
    pos: str
    
class BallDataType(TypedDict):
    x: float
    y: float

PlayersData = Dict[int, PlayerDataType]

class MatchData(TypedDict):
    ball: BallDataType
    players: PlayersData
    
MatchDict = Dict[int, MatchData]

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
        matches: MatchDict = json.loads(text_data)
        await PlayerConsumer.broadcast_data(matches)
        print(matches)
    
    async def disconnect(self, code):
        GameLoopConsumer.game_loop_client = None
        return await super().disconnect(code)
    

# Create your views here.
class PlayerConsumer(AsyncWebsocketConsumer):
    players = {}
    
    @classmethod
    def show_players(cls):
        print("show_players():")
        for key, value in cls.players.items():
            print(f"{key} -> {value}")
            
    @classmethod
    async def broadcast_data(cls, matches: MatchDict):
        for match_id, match in matches.items():
            payload = {
                "ball": match["ball"],
            }
            for player_id, player in match["players"].items():
                payload[f"player_{player['pos']}"] = {
                    "x": player["x"],
                    "y": player["y"]
                }
            for player_id, player in match["players"].items():
                await cls.players[int(player_id)]["client"].send(json.dumps(payload))
    
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
        
            
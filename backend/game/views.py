from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, TypedDict

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: int
    match_id: int
    action: str

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
    num_players = 0
    new_match_id = 1
    
    
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
                "action": "coordinates"
            }
            for player_id, player in match["players"].items():
                payload[f"player_{player['pos']}"] = {
                    "x": player["x"],
                    "y": player["y"]
                }
            for player_id, player in match["players"].items():
                player = cls.players.get(int(player_id), None)
                if player is not None:
                    await player["client"].send(json.dumps(payload))
    
    async def connect(self):
        await self.accept()
        PlayerConsumer.num_players += 1
        if PlayerConsumer.num_players % 2 != 0:
            PlayerConsumer.new_match_id += 1

        payload = {
            "action": "connect",
            "match_id": PlayerConsumer.new_match_id,
		}
        
        await self.send(json.dumps(payload))

    async def disconnect(self, close_code):
        PlayerConsumer.players.pop(self.player_id)
        self.close(close_code, "bye!^^")

    async def player_ready_action(self, data):
        self.player_id = data["player_id"]
        self.match_id = data["match_id"]
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
        
    async def player_move_action(self, data: PlayerMoveDataType):
        await GameLoopConsumer.send_to_game_loop(data)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        
        if data["action"] == "player_move":
            await self.player_move_action(data)
            return
        
        if data["action"] == "ready":
            await self.player_ready_action(data)
            return
         
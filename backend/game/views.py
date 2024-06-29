from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .game_engine.pong import *
from typing import Dict, TypedDict
import uuid
from backend.utils import redis_client

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: str
    match_id: str
    action: str

class PlayerDataType(TypedDict):
    x: float
    y: float
    pos: str
    points: int
    
class BallDataType(TypedDict):
    x: float
    y: float

PlayersData = Dict[str, PlayerDataType]

class MatchData(TypedDict):
    ball: BallDataType
    players: PlayersData
    
MatchDict = Dict[str, MatchData]

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
        redis_client.set("matches", text_data)

        await self.channel_layer.group_send("match", {
            "type": "match.coordinates",
            "text": "new"
        })
        
        print(text_data)

    async def disconnect(self, code):
        GameLoopConsumer.game_loop_client = None
        return await super().disconnect(code)
    

# Create your views here.
class PlayerConsumer(AsyncWebsocketConsumer):
    num_players = 0
    new_match_id = str(uuid.uuid4())
    
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add("match", self.channel_name)
        
        PlayerConsumer.num_players += 1
        if PlayerConsumer.num_players % 2 != 0:
            PlayerConsumer.new_match_id = str(uuid.uuid4())

        payload = {
            "action": "connect",
            "match_id": PlayerConsumer.new_match_id,
            "player_id": str(uuid.uuid4()), #this is temporary, the player_id should come somewhere else like from an http route or from the client
		}
        
        await self.send(json.dumps(payload))

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        
        if data["action"] == "player_move":
            await self.player_move_action(data)
            return
        
        if data["action"] == "ready":
            await self.player_ready_action(data)
            return

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("match", self.channel_name)
        self.close(close_code, "bye!^^")
    

    async def player_ready_action(self, data):
        self.player_id = data["player_id"]
        self.match_id = data["match_id"]
        
        # match_data = dict()
        # if redis_client.exists(self.match_id):
        #     match_data = redis_client.get(self.match_id).decode()
        #     match_data = json.loads(match_data)
        
        # print(f"match_data: {match_data}")
        # match_data[data["player_id"]] = self.channel_name
        # redis_client.set(self.match_id, json.dumps(match_data))
        
        payload = {
            "action": "player_connect",
            "player_id": data["player_id"],
            "match_id": data["match_id"],
            "max_scores": 5 #TODO: this could come from database or .env
        }
        await GameLoopConsumer.send_to_game_loop(payload)
        
    async def player_move_action(self, data: PlayerMoveDataType):
        await GameLoopConsumer.send_to_game_loop(data)
        
    async def match_coordinates(self, event):
        matches_data = redis_client.get("matches").decode()
        matches_data = json.loads(matches_data)
        match = matches_data[self.match_id]

        payload = {
            "ball": match["ball"],
            "action": "coordinates"
        }
        for player_id, player in match["players"].items():
            payload[f"player_{player['pos']}"] = {
                "x": player["x"],
                "y": player["y"],
                "points": player["points"]
            }

        await self.send(json.dumps(payload))
        print(f"p_id: {self.player_id} match: {match}")
         
         
class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        payload = {
            'status': 'connected'
        }
        await self.send(json.dumps(payload))

    async def receive(self, text_data):
        print(text_data)

        data = json.loads(text_data)
        
        if data["action"] == "create":
            await self.create_tournament(data)

    async def disconnect(self, close_code):
        await self.close(close_code)
        
    async def create_tournament(self, data):
        payload = {
            "status": "enter_tournament",
            "tournament_id": str(uuid.uuid4())
        }
        await self.send(json.dumps(payload))
        
         
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add("notification", self.channel_name)
        
        payload = {
            'status': 'connected'
        }
        await self.send(json.dumps(payload))

    async def receive(self, text_data):
        print(text_data)
        
        data = json.loads(text_data)
        
        if data["action"] == "register":
            await self.register_player(data)
            return 
        
        if data["action"] == "invite_to_tournament":
            await self.invite_to_tournament(data)
            return

        await self.channel_layer.group_send(
            "notification",
            {
                "type": "notification.message",
                "text": text_data,
            },
        )
        
    async def notification_message(self, event):
        await self.send(text_data=event["text"])

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("chat", self.channel_name)
        await self.close(close_code)
        
    async def register_player(self, data):
        if "player_id" not in data:
            await self.disconnect(None)
            return

        redis_client.set(data["player_id"], self.channel_name)
        await self.send(json.dumps({"status": "registered"}))
        
    async def tournament_invitation(self, event):
        print(event["text"])
        await self.send(event["text"])
        
    async def invite_to_tournament(self, data):
        if "friend_id" not in data:
            return
        if "tournament_id" not in data:
            return
        
        channel_name = redis_client.get(data["friend_id"]).decode('utf-8')
        
        payload = {
            "action": "do_something",
            "tournament_id": data["tournament_id"]
        }
        
        print(f"channel_name: {channel_name}")
        await self.channel_layer.send(channel_name, {
            "type": "tournament.invitation",
            "text": json.dumps(payload)
        })
        
        payload = {
            "status": "success",
            "text": "invitation sent"
        }
        await self.send(json.dumps(payload))
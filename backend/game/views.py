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
    async def connect(self):
        await self.accept()
        redis_client.set("game_loop", self.channel_name)

    
    async def receive(self, text_data):
        redis_client.set("matches", text_data)

        await self.channel_layer.group_send("match", {
            "type": "match.coordinates",
            "text": "new"
        })

    async def disconnect(self, code):
        redis_client.delete("game_loop")
        return await super().disconnect(code)
    
    async def player_move(self, event):
        print(event)
        await self.send(json.dumps(event))
        
    async def player_connect(self, event):
        await self.send(json.dumps(event))
    

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
        return await super().disconnect(close_code)
    

    async def player_ready_action(self, data):
        self.player_id = data["player_id"]
        self.match_id = data["match_id"]
        
        match_data = dict()
        if redis_client.exists(self.match_id):
            match_data = redis_client.get(self.match_id).decode()
            match_data = json.loads(match_data)
        
        print(f"match_data: {match_data}")
        match_data[data["player_id"]] = self.channel_name
        redis_client.set(self.match_id, json.dumps(match_data))
        
        payload = {
            "type": "player.connect",
            "action": "player_connect",
            "player_id": data["player_id"],
            "match_id": data["match_id"],
            "max_scores": 5 #TODO: this could come from database or .env
        }
        
        game_loop_channel = redis_client.get("game_loop").decode()
        
        await self.channel_layer.send(game_loop_channel, payload)
        
    async def player_move_action(self, data: PlayerMoveDataType):
        game_loop_channel = redis_client.get("game_loop").decode()
        
        data["type"] = "player.move"
        await self.channel_layer.send(game_loop_channel, data)
        
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
        # print(f"p_id: {self.player_id} match: {match}")
         
         
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
            return
        
        if data["action"] == "join":
            await self.join_tournament(data)
            return

    async def disconnect(self, close_code):
        if self.tournament_id:
            self.channel_layer.group_discard(self.tournament_id)
        return await super().disconnect(close_code)
        
    async def create_tournament(self, data):
        self.tournament_id = str(uuid.uuid4())
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        self.player_id = data["player_id"]
        
        tournament_data = {
            "players": [self.player_id]
        }
        redis_client.set(self.tournament_id, json.dumps(tournament_data))
        
        payload = {
            "status": "enter_tournament",
            "tournament_id": self.tournament_id,
        }
        await self.send(json.dumps(payload))
        
    async def join_tournament(self, data):
        has_tournament_id = "tournament_id" in data
        has_player_id = "player_id" in data
        if not has_player_id or not has_tournament_id:
            payload = {"status": "failed_to_join_tournament"}
            await self.send(json.dumps(payload))
            return

        self.player_id = data["player_id"]
        self.tournament_id = data["tournament_id"]
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        
        tournament_data = redis_client.get(self.tournament_id).decode()
        tournament_data = json.loads(tournament_data)
        tournament_data["players"].append(self.player_id)
        redis_client.set(self.tournament_id, json.dumps(tournament_data))
        
        payload = {"status": "joined tournament succesfuly"}
        await self.send(json.dumps(payload))
        
        await self.channel_layer.group_send(self.tournament_id, {"type": "tournament.new.player"})
        
    async def tournament_new_player(self, event):
        payload = redis_client.get(self.tournament_id).decode()
        payload = json.loads(payload)
        payload["status"] = "player_joined"
        await self.send(json.dumps(payload))
        
        
         
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        await self.channel_layer.group_add("notification", self.channel_name)
        
        self.player_id = str(uuid.uuid4())
        redis_client.set(self.player_id, self.channel_name)

        payload = {
            'status': 'connected',
            'player_id': self.player_id
        }
        await self.send(json.dumps(payload))

    async def receive(self, text_data):
        print(text_data)
        
        data = json.loads(text_data)
        
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
        return await super().disconnect(close_code)
        
    async def tournament_invitation(self, event):
        print("tournament_invitation()")
        await self.send(json.dumps(event))
        
    async def invite_to_tournament(self, data):
        print("invite_to_tournament()")
        if "friend_id" not in data:
            return
        if "tournament_id" not in data:
            return
        
        channel_name = redis_client.get(data["friend_id"]).decode('utf-8')
        
        payload = {
            "type": "tournament.invitation",
            "status": "tournament_invitation",
            "tournament_id": data["tournament_id"]
        }
        
        await self.channel_layer.send(channel_name, payload)
        
        payload = {
            "status": "invitation_sent"
        }
        await self.send(json.dumps(payload))
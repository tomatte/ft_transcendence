from django.shortcuts import render
from asgiref.sync import async_to_sync
import json
from typing import Dict, TypedDict
import uuid
from backend.utils import redis_client, MyAsyncWebsocketConsumer, UserState, OnlineState
from .tournament_state import TournamentState
from .validations import TournamentValidation
from .tasks import emit_group_event_task
from .my_types import *
import random
from .match_state import MatchState

MatchDict = Dict[str, MatchData]

class GameLoopConsumer(MyAsyncWebsocketConsumer):
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
        await self.send_json(event)
        
    async def player_connect(self, event):
        await self.send_json(event)
    

# Create your views here.
class MatchConsumer(MyAsyncWebsocketConsumer):
    num_players = 0
    new_match_id = str(uuid.uuid4())
    
    async def connect(self):
        is_authenticated = await self.authenticate()
        if is_authenticated == False:
            return 
        
        await self.channel_layer.group_add("match", self.channel_name)
        
        MatchConsumer.num_players += 1
        if MatchConsumer.num_players % 2 != 0:
            MatchConsumer.new_match_id = str(uuid.uuid4())

        payload = {
            "action": "connect",
            "match_id": MatchConsumer.new_match_id,
            "player_id": str(uuid.uuid4()), #this is temporary, the player_id should come somewhere else like from an http route or from the client
		}
        
        await self.send_json(payload)

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
            match_data = redis_client.get_json(self.match_id)
        
        print(f"match_data: {match_data}")
        match_data[data["player_id"]] = self.channel_name
        redis_client.set_json(self.match_id, match_data)
        
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
        matches_data = redis_client.get_json("matches")
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

        await self.send_json(payload)
        # print(f"p_id: {self.player_id} match: {match}")
         
         
class TournamentConsumer(MyAsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validation = TournamentValidation(self)
    
    async def connect(self):
        is_authenticated = await self.authenticate()
        if is_authenticated == False:
            return
        
        self.user = self.scope['user']
        self.player_id = self.user.username
        self.tournament_state = TournamentState(self.user)
        
        await self.send_json({ 'name': 'connected' })

    async def receive(self, text_data):
        print(text_data)

        data = json.loads(text_data)
        
        if data["action"] == "create":
            await self.create_tournament(data)
            return
        
        if data["action"] == "join":
            await self.join_tournament(data)
            return
        
        if data["action"] == "start":
            await self.start_tournament()
            return

    async def disconnect(self, close_code):
        if not hasattr(self, "tournament_id"):
            return await super().disconnect(close_code)
    
        self.channel_layer.group_discard(self.tournament_id, self.channel_name)

        await self.tournament_state.exit()
        
        return await super().disconnect(close_code)
        
    async def create_tournament(self, data):
        self.tournament_id = self.tournament_state.create()
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        
        payload = {
            "name": "creating_tournament",
            "tournament_id": self.tournament_id,
        }
        
        await self.send_json(payload)
        
    async def join_tournament(self, data):
        self.validation.join_tournament.validate_data(data)
        if not self.validation.join_tournament.can_join(data):
            #TODO: send error message to client
            return 

        self.tournament_id = data["tournament"]["id"]
        
        self.tournament_state.join(self.tournament_id)
    
        players = self.tournament_state.get_players(self.tournament_id)
        if len(players) == 4:
            self.tournament_state.shuffle_players(self.tournament_id)
            players = self.tournament_state.get_players(self.tournament_id)
        
        await self.send_json({
            "name": "enter_tournament",
            "tournament_id": self.tournament_id,
            "players": players
        })
        
        await self.channel_layer.group_send(self.tournament_id, {
            "type": "tournament.update_players",
            "players": players
        })
        
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        
        # if len(tournament_data["players"]) == 4:
        #     self.create_start_tournament_task()
            
    async def start_tournament(self):
        print("start_tournament()")
        match_id_1 = MatchState.create("semi_final")
        match_id_2 = MatchState.create("semi_final")
        
        self.tournament_state.add_semi_final_matches(match_id_1, match_id_2)
        
        players = self.tournament_state.get_players_usernames(self.tournament_id)
        
        MatchState.add_players(match_id_1, players[0], players[1])
        MatchState.add_players(match_id_2, players[2], players[3])
        MatchState.start(match_id_1)
        MatchState.start(match_id_2)
        
        await self.channel_layer.group_send(self.tournament_id, {
            "type": "match.start"
        })
            
    async def tournament_update_players(self, event):
        await self.send_json({
            "name": "update_players",
            "players": event["players"],
            "tournament_id": self.tournament_id
        })
        
    async def match_start(self, event):
        await self.send_json({"name": "start_match"})
        
    async def tournament_cancel(self, event):
        print("EVENT tournament_cancel()")
        
    def get_tournament_data(self) -> TournamentData:
        return redis_client.get_json(self.tournament_id)
    
    def create_start_tournament_task(self):
        args = (self.tournament_id, {"type": "tournament.start"})
        emit_group_event_task.apply_async(args=args, countdown=5)
        
         
class NotificationConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        is_authenticated = await self.authenticate()
        if is_authenticated == False:
            return 
        
        self.user = self.scope['user']
        self.user_state = UserState(self.user, self.channel_name)
        
        payload = {
            'name': "new_connection",
            'status': 'connected',
            'player_id': self.user.username,
            'notifications': self.user_state.notification.get(),
            'online_players': self.user_state.online.get_all()
        }
        
        await self.user_state.online.connected()
        
        await self.channel_layer.group_add(self.user.username, self.channel_name)
        await self.channel_layer.group_add("notification", self.channel_name)

        await self.send_json(payload)

    async def receive(self, text_data):
        print(f"{self.user.username} received a notification:")
        print(text_data)
        
        data = json.loads(text_data)
        
        if data["action"] == "invite_to_tournament":
            await self.invite_to_tournament(data)
            return

        await self.channel_layer.group_send( #TODO: remove later? 
            "notification",
            {
                "type": "notification.message",
                "text": text_data,
            },
        )
        
    async def notification_message(self, event):
        await self.send(text_data=event["text"])

    async def disconnect(self, close_code):
        if hasattr(self, 'user_state'):
            await self.user_state.online.disconnected()
        await self.channel_layer.group_discard("chat", self.channel_name)
        return await super().disconnect(close_code)
        
    async def tournament_invitation(self, event):
        print(f"{self.user.username} received a tournament invitation")

        
        owner = OnlineState.get_user(event['owner'])
        
        payload = {
            "name": "new_notification",
            "type": "tournament",
            "owner": {
                "username": owner['username'],
                "nickname": owner['nickname'],
                "avatar": owner['avatar'],
            },
            "tournament_id": event['tournament_id'] 
        }
        
        self.user_state.notification.add(payload)
        
        print(f"NOTIFICATION_STATE: {self.user_state.notification.get()}")
        await self.send_json(payload)
        
    async def invite_to_tournament(self, data):
        print("invite_to_tournament()")
        if "friend" not in data:
            return
        if "tournament_id" not in data:
            return
        
        notification_event = {
            "type": "tournament.invitation",
            "owner": self.user.username,
            "tournament_id": data['tournament_id']
        }
        
        await self.user_state.notification.notify(
            data["friend"],
            notification_event
        )
        
        await self.send_json({ 'name': 'sent_invitation' })
        
    async def notification_online_players(self, event):
        print("notification_online_players()")
        event["status"] = "online_players"
        payload = {
            "name": "update_online_players",
            "status": "online_players",
            "online_players": event["players"]
        }
        await self.send_json(payload)
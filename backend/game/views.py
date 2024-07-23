from django.shortcuts import render
from asgiref.sync import async_to_sync
import json
from typing import Dict, TypedDict
import uuid
from backend.utils import redis_client, MyAsyncWebsocketConsumer, UserState, OnlineState
from .tournament_state import TournamentState
from .validations import TournamentValidation
from .tasks import emit_group_event_task, Task
from .my_types import *
import random
from .match_state import MatchState

MatchDict = Dict[str, MatchData]

class GameLoopConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        redis_client.set("game_loop", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data["action"] == "tick":
            await self.match_tick()
            return
        
        if data["action"] == "match_end":
            await self.match_end(data)
            return


    async def disconnect(self, code):
        redis_client.delete("game_loop")
        return await super().disconnect(code)
    
    async def match_tick(self):
        await self.channel_layer.group_send("match", {
            "type": "match.tick"
        })
        
    async def match_end(self, data):
        await self.channel_layer.group_send(data["match_id"], {
            "type": "match.end"
        })    
    

# Create your views here.
class MatchConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        if await self.authenticate() == False:
            return
        
        self.user = self.scope['user']
        
        self.match_id = redis_client.get_map_str(self.user.username, "match_id")
        if self.match_id == None or self.match_id == "":
            print("match error: match_id not found")
            return await self.close()
        
        await self.channel_layer.group_add(self.match_id, self.channel_name)
        await self.channel_layer.group_add("match", self.channel_name)
        MatchState.ready(self.match_id, self.user.username)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        
        if data["action"] == "move":
            await self.player_move(data)
            return
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("match", self.channel_name)
        return await super().disconnect(close_code)

    async def player_move(self, data: PlayerMoveDataType):
        match = MatchState.get(self.match_id)
        if self.user.username == match["player_left"]["username"]:
            match["player_left"]["move"] = data["key"]
        else:
            match["player_right"]["move"] = data["key"]
        MatchState.set(self.match_id, match)
        
    async def match_tick(self, event):
        match = MatchState.get(self.match_id)
        payload = {
            "name": "coordinates",
            "player_left": match["player_left"],
            "player_right": match["player_right"],
            "ball": match["ball"],
        }
        
        await self.send_json(payload)
        
    async  def match_end(self, event):
        print(f"{self.user.username}: match_end()")
        match = MatchState.get(self.match_id)
        if match["match_type"] != "normal":
            await self.end_match_tournament()
            return
            
    async def end_match_tournament(self):
        print(f"{self.user.username}: end_match_tournament()")
        match = MatchState.get(self.match_id)
        if match["match_type"] == "semi_final":
            event_type = "tournament.semifinal_end"
        else:
            event_type = "tournament.final_end"
        
        redis_client.set_map_str(self.user.username, "match_id", "")
        await self.channel_layer.group_discard("match", self.channel_name)
        await self.channel_layer.group_discard(self.match_id, self.channel_name)
        
        tournament_channel_name = redis_client.get_map_str(self.user.username, "tournament_channel")
        await self.channel_layer.send(tournament_channel_name, {
            "type": event_type,
            "match_id": self.match_id
        })
        
        await self.disconnect(1000)
        
         
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
        
        UserState.set_value(self.user.username, "tournament_channel", self.channel_name)
        
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
        if hasattr(self, "user"):
            UserState.set_value(self.user.username, "tournament_channel", "")
    
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
        self.tournament_state.set_value("status", "started")
        
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
        
    async def tournament_semifinal_end(self, event):
        print(f"EVENT {self.user.username} tournament_semifinal_end()")
        match = MatchState.get(event["match_id"])
        
        player_left = OnlineState.get_user(match["player_left"]["username"])
        player_left["points"] = match["player_left"]["points"]
        
        player_right = OnlineState.get_user(match["player_right"]["username"])
        player_right["points"] = match["player_right"]["points"]
        
        await self.send_json({
            "name": "semifinal_end",
            "player_left": player_left,
            "player_right": player_right
        })
        
        Task.send(self.channel_name, {"type": "tournament.bracket_final"}, 5)
        
    async def tournament_bracket_final(self, event):
        print(f"EVENT {self.user.username} tournament_bracket_final()")
        
        matches = TournamentState.get_value(self.tournament_id, "semi_finals")
        match1 = MatchState.get(matches[0])
        match2 = MatchState.get(matches[1])
        
        players = TournamentState.get_players(self.tournament_id)
        
        winner_left = MatchState.filter_winner(match1)
        winner_left = (
            players[0] 
            if players[0]["username"] == match1["player_left"]["username"] 
            else players[1]
        )
        
        winner_right = MatchState.filter_winner(match2)
        winner_right = (
            players[2] 
            if players[2]["username"] == match2["player_left"]["username"] 
            else players[3]
        )
        
        final = {
            "player_left": winner_left,
            "player_right": winner_right
        }
        
        await self.send_json({
            "name": "bracket_final_match",
            "players": players,
            "final": final
        })
        
        self.start_final(winner_left["username"], winner_right["username"])
        
    def start_final(self, winner1, winner2):
        sent = TournamentState.get_value(self.tournament_id, "final_bracket_event_sent")
        sent += 1
        self.tournament_state.set_value("final_bracket_event_sent", sent)
        if sent != 4:
            return
        
        event_payload = {
            "type": "tournament.final_start",
            "winner1": winner1,
            "winner2": winner2
        }
        
        Task.send_group(self.tournament_id, event_payload, 5)
        
    async def tournament_final_start(self, event):
        print(f"EVENT {self.user.username} tournament_final_start()")
        me = self.user.username
        if event["winner1"] != me and event["winner2"] != me:
            return
        
        match_id = MatchState.create("final")
        
        self.tournament_state.add_final_match(match_id)
        
        MatchState.add_players(match_id, event["winner1"], event["winner2"])
        MatchState.start(match_id)
        
        await self.send_json({"name": "start_match"})

        
    def get_tournament_data(self) -> TournamentData:
        return redis_client.get_json(self.tournament_id)
    
    async def tournament_final_end(self, event):
        print(f"EVENT {self.user.username} tournament_final_end()")
        match = MatchState.get(event["match_id"])
        
        player_left = OnlineState.get_user(match["player_left"]["username"])
        player_left["points"] = match["player_left"]["points"]
        
        player_right = OnlineState.get_user(match["player_right"]["username"])
        player_right["points"] = match["player_right"]["points"]
        
        await self.send_json({
            "name": "final_end",
            "player_left": player_left,
            "player_right": player_right
        })
        
        # Task.send(self.channel_name, {"type": "tournament.bracket_end"}, 5)
    
         
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
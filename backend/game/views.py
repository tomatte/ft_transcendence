from django.shortcuts import render
from asgiref.sync import async_to_sync, sync_to_async
import json
import asyncio
from typing import Dict, TypedDict
import uuid
from backend.utils import redis_client, MyAsyncWebsocketConsumer, UserState, OnlineState
from .tournament_state import TournamentState
from .validations import TournamentValidation
from .tasks import emit_group_event_task, Task
from .my_types import *
import random
from .match_state import MatchState
from .redis_models import TournamentRedis, MatchRedis
from backend.tournament_utils import store_tournament
from tournament.models import Tournament, Match, MatchPlayer
from tournament.views import create_tournament, create_match

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
        
    async def player_move(self, event):
        await self.send_json(event)
    

# Create your views here.
class MatchConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        if await self.authenticate() == False:
            return

        self.game_loop_channel = redis_client.get("game_loop").decode()
        self.match_id = redis_client.get_map_str(self.user.username, "match_id")
        if self.match_id == None or self.match_id == "":
            print("match error: match_id not found")
            return await self.close(1000)
        
        await self.channel_layer.group_add(self.match_id, self.channel_name)
        await self.channel_layer.group_add("match", self.channel_name)
        self.in_match_group = True
        MatchState.ready(self.match_id, self.user.username)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"data: {data}")
        
        if data["action"] == "move":
            await self.player_move(data)
            return
        
        """ TODO: LOCAL """
        if data["action"] == "player2_move":
            await self.player2_move(data)
            return
        
    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard("match", self.channel_name)
        except asyncio.CancelledError:
            print("Task was cancelled")
        if self.match_id:
            await self.channel_layer.group_discard(self.match_id, self.channel_name)
        if redis_client.hexists(self.user.username, "match_id"):
            match = MatchState.get(self.match_id)
            if match != None and match["phase"] == "running":
                return
            redis_client.set_map_str(self.user.username, "match_id", "")

    async def player_move(self, data: PlayerMoveDataType):
        data["type"] = "player.move"
        data["username"] = self.user.username
        await self.channel_layer.send(self.game_loop_channel, data)
        
        """ TODO: LOCAL """
    async def player2_move(self, data: PlayerMoveDataType):
        data["type"] = "player.move"
        data["action"] = "move"
        data["username"] = f"{self.user.username}2"
        await self.channel_layer.send(self.game_loop_channel, data)
        
    async def match_tick(self, event):
        match = MatchState.get(self.match_id)
        payload = {
            "name": "coordinates",
            "player_left": match["player_left"],
            "player_right": match["player_right"],
            "ball": match["ball"],
        }
        
        if not self.in_match_group:
            return
        await self.send_json(payload)
        
    async  def match_end(self, event):
        print(f"{self.user.username}: match_end()")
        match = MatchState.get(self.match_id)
        
        if match["match_type"] == "random":
            await self.end_random_match()
        elif match["match_type"] == "local":
            await self.end_local_match()
        else:
            await self.end_match_tournament()
            
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
        
        self.in_match_group = False
        await self.close(1000)
        
    async def end_random_match(self):
        redis_client.set_map_str(self.user.username, "match_id", "")
        await self.channel_layer.group_discard("match", self.channel_name)
        await self.channel_layer.group_discard(self.match_id, self.channel_name)
        
        match = MatchState.get(self.match_id)
        
        player_left = OnlineState.get_user(match["player_left"]["username"])
        player_left["points"] = match["player_left"]["points"]
        player_left["winner"] = match["player_left"]["winner"]
        
        player_right = OnlineState.get_user(match["player_right"]["username"])
        player_right["points"] = match["player_right"]["points"]
        player_right["winner"] = match["player_right"]["winner"]
        
        payload = {
            "name": "random_match_end",
            "player_left": player_left,
            "player_right": player_right
        }
        
        await self.send_json(payload)
        await self.close(1000)
        
        if redis_client.hexists("global_matches", self.match_id):
            await create_match(MatchRedis(self.match_id))
            redis_client.hdel("global_matches", self.match_id)
            
    async def end_local_match(self):
        redis_client.set_map_str(self.user.username, "match_id", "")
        await self.channel_layer.group_discard("match", self.channel_name)
        await self.channel_layer.group_discard(self.match_id, self.channel_name)
        
        match = MatchState.get(self.match_id)
        if match["should_delete"]:
            redis_client.hdel("global_matches", self.match_id)
            await self.close(1000)
            return
        else:
            match["should_delete"] = True
            MatchState.set(self.match_id, match)
        
        player_left = {}
        player_left["points"] = match["player_left"]["points"]
        player_left["winner"] = match["player_left"]["winner"]
        
        player_right = {}
        player_right["points"] = match["player_right"]["points"]
        player_right["winner"] = match["player_right"]["winner"]
        
        await self.send_json({
            "name": "end_local_match",
            "player_left": player_left,
            "player_right": player_right
        })
        await self.close(1000)
        
        
         
class TournamentConsumer(MyAsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validation = TournamentValidation(self)
    
    async def connect(self):
        if not await self.authenticate():
            return
        
        self.player_id = self.user.username
        self.tournament_state = TournamentState(self.user)
        
        UserState.set_value(self.user.username, "tournament_channel", self.channel_name)
        
        tournament_id = redis_client.get_map_str(self.user.username, "tournament_id")
        if tournament_id != None and tournament_id != "":
            await self.reconnect(tournament_id)
        else: 
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
        print(f"***{self.user.username} disconnected from tournament***")
        if not hasattr(self, "tournament_id") or not hasattr(self, "user"):
            return
        await self.tournament_state.exit()
        await self.channel_layer.group_discard(self.tournament_id, self.channel_name)
        
    async def reconnect(self, tournament_id):
        tournament = TournamentState.get(tournament_id)
        if tournament == None:
            redis_client.set_map_str(self.user.username, "tournament_id", "")
            await self.send_json({ 'name': 'connected' })
            return
        
        self.tournament_id = tournament_id
        self.tournament_state.tournament_id = tournament_id
        redis_client.set_map_str(self.user.username, "tournament_channel", self.channel_name)
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        
        await self.send_json({
            'name': 'reconnected',
            'tournament_id': self.tournament_id,
            'players': TournamentState.get_players(self.tournament_id)
        })
        
        if "stage" in tournament and tournament["stage"] == "semifinal_result":
            match = TournamentState.get_match_by_tournament(self.tournament_id, self.user.username)
            await self.send_tournament_semifinal_end_result(match)
        
    async def create_tournament(self, data):
        self.tournament_id = self.tournament_state.create()
        self.is_owner = True
        await self.channel_layer.group_add(self.tournament_id, self.channel_name)
        
        payload = {
            "name": "creating_tournament",
            "tournament_id": self.tournament_id,
        }
        
        await self.send_json(payload)
    
    async def terminate_tournament(self):
        # TODO: save tournament data and delete match from redis
        await self.close(1000)
        if redis_client.hexists("global_tournament", self.tournament_id):
            tournament_redis = TournamentRedis(self.tournament_id)
            redis_client.hdel("global_tournament", self.tournament_id)
            await create_tournament(tournament_redis)
        
    async def join_tournament(self, data):
        self.validation.join_tournament.validate_data(data)
        self.is_owner = False
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
        
        await TournamentState.erase_invitations(self.tournament_id)
            
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
        if not self.is_owner:
            await self.send_json({ "name": "cancel_tournament" })
        await self.close(1000)
        
    async def send_tournament_semifinal_end_result(self, match):
        player_left = OnlineState.get_user(match["player_left"]["username"])
        player_left["points"] = match["player_left"]["points"]
        player_left["winner"] = match["player_left"]["winner"]
        
        player_right = OnlineState.get_user(match["player_right"]["username"])
        player_right["points"] = match["player_right"]["points"]
        player_right["winner"] = match["player_right"]["winner"]
        
        await self.send_json({
            "name": "semifinal_end",
            "player_left": player_left,
            "player_right": player_right
        })
        
    async def tournament_semifinal_end(self, event):
        print(f"EVENT {self.user.username} tournament_semifinal_end()")
        match = MatchState.get(event["match_id"])
        
        await self.send_tournament_semifinal_end_result(match)
        
        self.tournament_state.set_value("stage", "semifinal_result")
        
        Task.send_tournament(self.user.username, {"type": "tournament.bracket_final"}, 5)
        
    async def tournament_bracket_final(self, event):
        print(f"EVENT {self.user.username} tournament_bracket_final()")
        
        self.tournament_state.set_value("stage", "")
        
        matches = TournamentState.get_value(self.tournament_id, "semi_finals")
        match1 = MatchState.get(matches[0])
        match2 = MatchState.get(matches[1])
        
        winner_left = MatchState.filter_winner(match1)
        winner_right = MatchState.filter_winner(match2)
        
        players = TournamentState.get_players(self.tournament_id)
        
        final = {
            "player_left": winner_left,
            "player_right": winner_right
        }
        
        await self.send_json({
            "name": "bracket_final_match",
            "players": players,
            "final": final
        })
        
        self.start_final(winner_left, winner_right)
        
    def start_final(self, winner1, winner2):
        sent = TournamentState.get_value(self.tournament_id, "final_bracket_event_sent")
        sent += 1
        self.tournament_state.set_value("final_bracket_event_sent", sent)
        if sent != 4:
            return
        
        match_id = MatchState.create("final")
        
        event_payload = {
            "type": "tournament.final_start",
            "winner1": winner1["username"] if winner1 else None,
            "winner2": winner2["username"] if winner2 else None,
            "match_id": match_id
        }
        
        Task.send_group(self.tournament_id, event_payload, 5)
        
    async def tournament_final_start(self, event):
        print(f"EVENT {self.user.username} tournament_final_start()")
        me = self.user.username
        if event["winner1"] != me and event["winner2"] != me:
            await self.close(1000)
            return
        
        self.tournament_state.add_final_match(event["match_id"])
        
        MatchState.add_players(event["match_id"], event["winner1"], event["winner2"])
        MatchState.start(event["match_id"])
        
        await self.send_json({"name": "start_match"})

        
    def get_tournament_data(self) -> TournamentData:
        return redis_client.get_json(self.tournament_id)
    
    async def tournament_final_end(self, event):
        print(f"EVENT {self.user.username} tournament_final_end()")
        match = MatchState.get(event["match_id"])
        
        player_left = OnlineState.get_user(match["player_left"]["username"])
        player_left["points"] = match["player_left"]["points"]
        player_left["winner"] = match["player_left"]["winner"]
        
        player_right = OnlineState.get_user(match["player_right"]["username"])
        player_right["points"] = match["player_right"]["points"]
        player_right["winner"] = match["player_right"]["winner"]
        
        await self.send_json({
            "name": "final_end",
            "player_left": player_left,
            "player_right": player_right
        })
        
        await self.terminate_tournament()
        
    async def exit_semifinal_looser(self):
            redis_client.set_map_str(self.user.username, "tournament_id", "")
            await self.close(1000)
         
class NotificationConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        if not await self.authenticate():
            return 
        
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
        
        await self.enter_running_match()
        await self.enter_running_tournament()

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
    
    async def enter_running_match(self):
        match_id = redis_client.get_map_str(self.user.username, "match_id")
        if match_id == None or match_id == "":
            return
        
        match = MatchState.get(match_id)
        if match["match_type"] == "local":
            await self.send_json({"name": "enter_running_local_match"})
        else:
            await self.send_json({"name": "enter_running_match"})
        
    async def enter_running_tournament(self):
        tournament_id = redis_client.get_map_str(self.user.username, "tournament_id")
        if tournament_id == None or tournament_id == "":
            return
        
        tournament = TournamentState.get(tournament_id)
        if tournament == None:
            UserState.set_value(self.user.username, "tournament_id", "")
            UserState.set_value(self.user.username, "tournament_channel", "")
            return
        
        await self.send_json({"name": "enter_running_tournament"})
        
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
        
        TournamentState.add_invited_player(event['tournament_id'], self.user.username)
        
        print(f"NOTIFICATION_STATE: {self.user_state.notification.get()}")
        await self.send_json(payload)
        
    async def notification_new(self, event):
        print(f"{self.user.username} notification_new()")
        notification = event["data"]
        notification["name"] = "new_notification"
        print(notification)
        await self.send_json(notification)
        
    async def notification_dynamic(self, event):
        print(f"{self.user.username} notification_dynamic()")
        print(event)
        if "data" not in event:
            print("WARNING: no data")
            return
        await self.send_json(event["data"])
        
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
        
    async def notification_update(self, event):
        print("notification_update()")
        notifications = self.user_state.notification.get()
        await self.send_json({
            "name": "update_notifications",
            "notifications": notifications
        })
        
class RandomMatchConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        if not await self.authenticate():
            return 
        
        print(f"RandomMatchConsumer {self.user.username} connect()")
        
        await self.channel_layer.group_add("random_match", self.channel_name)
        if redis_client.exists("random_match"):
            await self.join_random_match()
        else:
            await self.create_random_match()
        
    async def receive(self, text_data):
        print(f"RandomMatchConsumer {self.user.username} receive()")
        print(text_data)
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("random_match", self.channel_name)
        if redis_client.exists("random_match"):
            redis_client.delete("random_match")
        
    async def create_random_match(self):
        match = MatchState.create("random", save=False)
        match["player_left"]["username"] = self.user.username
        redis_client.set_json("random_match", match)
        self.match_id = match["id"]
        
    async def join_random_match(self):
        match = redis_client.get_json("random_match")
        redis_client.delete("random_match")
        
        match["player_right"]["username"] = self.user.username
        match["phase"] = "start"
        MatchState.set(match["id"], match)
        self.match_id = match["id"]
        
        await self.channel_layer.group_send("random_match", {
            "type": "random_match.start"
        })
        
    async def random_match_start(self, event):
        redis_client.set_map_str(self.user.username, "match_id", self.match_id)
        await self.send_json({ "name": "start_random_match" })
        await self.close(1000)
        
        
class LocalMatchConsumer(MyAsyncWebsocketConsumer):
    async def connect(self):
        if not await self.authenticate():
            return 
        
        print(f"LocalMatchConsumer {self.user.username} connect()")
        
        await self.channel_layer.group_add("local_match", self.channel_name)
        
        match = MatchState.create("local", save=False)
        match["player_left"]["username"] = self.user.username
        match["player_right"]["username"] = f"{self.user.username}2"
        match["player_right"]["ready"] = True
        match["phase"] = "start"
        match["should_delete"] = False 
        redis_client.set_map_str(self.user.username, "match_id", match["id"])
        MatchState.set(match["id"], match)
        
        await self.send_json({ "name": "start" })
        await self.close(1000)
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("local_match", self.channel_name)

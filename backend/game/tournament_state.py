from backend.utils import redis_client as redis
import uuid
from datetime import datetime
from enum import Enum
from channels.layers import get_channel_layer
from backend.utils import OnlineState
import random
from .match_state import MatchState
from backend.utils import UserState

global_tournament_name = 'global_tournament'

class ExitTournament:
    def __init__(self, parent: 'TournamentState') -> None:
        self.parent = parent
        self.user = parent.user
        self.channel_layer = self.parent.channel_layer
        self.tournament_id = parent.tournament_id
        self.actions = {
            'creating': self.exit_creating,
        }
    
    async def exit(self):
        data = redis.get_map(global_tournament_name, self.parent.tournament_id)
        if data != None and data["status"] == "started":
            return
        if data != None:
            await self.actions[data['status']](data)
        
        await self.exit_user_state()
            
    async def exit_creating(self, data):
        await self.exit_tournament_state(data)
        await self.exit_user_state()
    
    async def exit_tournament_state(self, data):
        if self.parent.is_owner:
            await self.exit_owner()
        else:
            await self.exit_player(data)
    
    async def exit_owner(self):
        print("exit_owner()")
        redis.hdel(global_tournament_name, self.parent.tournament_id)
        await self.channel_layer.group_send(
            self.tournament_id,
            { 'type': 'tournament.cancel'}
        )
    
    async def exit_player(self, data):
        data = self.parent.get(self.parent.tournament_id)
        data["players"].remove(self.user.username)
        self.parent.set_value("players", data["players"])
        await self.channel_layer.group_send(self.tournament_id, {
            "type": "tournament.update_players",
            "players": self.parent.get_players(self.tournament_id)
        })

    async def exit_user_state(self):
        UserState.set_value(self.user.username, "tournament_id", "")
        UserState.set_value(self.user.username, "tournament_channel", "")

class TournamentState:
    @classmethod
    def add_invited_player(cls, tournament_id, username):
        data = cls.get(tournament_id)
        data["invited_players"].append(username)
        redis.set_map(global_tournament_name, tournament_id, data)
    
    @classmethod
    def get_match_by_tournament(cls, tournament_id, username):
        print("lets go")
        tournament = TournamentState.get(tournament_id)
        match = MatchState.get(tournament["semi_finals"][0])
        
        is_user_in_match = (
            username == match["player_left"]["username"]
            or username == match["player_right"]["username"]
        )
        
        if is_user_in_match:
            return match
        return MatchState.get(tournament["semi_finals"][1])
    
    @classmethod
    def get_players(self, id):
        data = redis.get_map(global_tournament_name, id)
        
        players = []
        for username in data["players"]:
            player = OnlineState.get_user(username)
            players.append(player)
            
        return players
    
    @classmethod
    def get_players_usernames(self, id):
        data = redis.get_map(global_tournament_name, id)
        return data["players"] if data else None
    
    @classmethod
    def shuffle_players(cls, tournament_id):
        data = redis.get_map(global_tournament_name, tournament_id)
        random.shuffle(data["players"])
        redis.set_map(global_tournament_name, tournament_id, data)
        return data["players"]
    
    @classmethod
    def get_value(cls, id, key):
        data = redis.get_map(global_tournament_name, id)
        return data[key]
    
    @classmethod
    def get(cls, id):
        return redis.get_map(global_tournament_name, id)
    
    def __init__(self, user) -> None:
        self.user = user
        self.channel_layer = get_channel_layer()
        self.is_owner = False
    
    def create(self):
        self.tournament_id = str(uuid.uuid4())
        self.is_owner = True
        
        payload = {
            'players': [self.user.username],
            'id': self.tournament_id,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'creating',
            'final_bracket_event_sent': 0,
            'invited_players': []
        }
        
        redis.set_map(
            global_tournament_name,
            self.tournament_id,
            payload
        )
        
        self.store_on_user_state(self.tournament_id)
        
        return self.tournament_id
    
    def join(self, id):
        self.tournament_id = id
        data = redis.get_map(global_tournament_name, id)
        if data == None:
            print("tournament not found")
            return
        
        data["players"].append(self.user.username)
        redis.set_map(global_tournament_name, id, data)
        self.store_on_user_state(id)
    
    async def exit(self):
        exit = ExitTournament(self)
        await exit.exit()
        
    def store_on_user_state(self, tournament_id):
        redis.set_map_str(
            self.user.username,
            'tournament_id', 
            tournament_id
        )
        
    def add_semi_final_matches(self, match_id_1, match_id_2):
        data = redis.get_map(global_tournament_name, self.tournament_id)
        data["semi_finals"] = (match_id_1, match_id_2)
        redis.set_map(global_tournament_name, self.tournament_id, data)
        
    def add_final_match(self, match_id):
        data = redis.get_map(global_tournament_name, self.tournament_id)
        data["final"] = (match_id)
        redis.set_map(global_tournament_name, self.tournament_id, data)
        
    def set_value(self, key, value):
        data = redis.get_map(global_tournament_name, self.tournament_id)
        data[key] = value
        redis.set_map(global_tournament_name, self.tournament_id, data)

    
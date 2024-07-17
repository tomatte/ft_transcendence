from backend.utils import redis_client as redis
import uuid
from datetime import datetime
from enum import Enum
from channels.layers import get_channel_layer

global_tournament_name = 'global_tournament'

class ExitTournament:
    def __init__(self, parent: 'TournamentState') -> None:
        self.parent = parent
        self.actions = {
            'creating': self.exit_creating,
        }
    
    async def exit(self):
        data = redis.get_map(global_tournament_name, self.parent.tournament_id)
        if data != None:
            await self.actions[data['phase']](data)
        
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
        self.parent.channel_layer.group_send(
            self.parent.tournament_id,
            { 'type': 'tournament.cancel'}
        )
    
    async def exit_player(self, data):
        pass
    
    async def exit_user_state(self):
        exists = redis.hexists(self.parent.user.username, 'tournament_id')
        if exists == False:
            return
        
        redis.hdel(self.parent.user.username, 'tournament_id')
    

class TournamentState:
    def __init__(self, user) -> None:
        self.user = user
        self.channel_layer = get_channel_layer()
        self.is_owner = False
        pass
    
    def create(self):
        self.tournament_id = str(uuid.uuid4())
        self.is_owner = True
        
        payload = {
            'players': [self.user.username],
            'id': self.tournament_id,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'phase': 'creating'
        }
        
        redis.set_map(
            global_tournament_name,
            self.tournament_id,
            payload
        )
        
        self._store_on_user_state()
        
        return self.tournament_id
    
    def join(self, owner):
        print(f"{self.user.username} JOINED a Tournament")
        pass
    
    async def exit(self):
        exit = ExitTournament(self)
        await exit.exit()
        
    def _store_on_user_state(self):
        if redis.hexists(self.user.username, 'tournament_id'):
            return

        redis.set_map_str(
            self.user.username,
            'tournament_id', 
            self.tournament_id
        )

    
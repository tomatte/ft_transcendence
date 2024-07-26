import asyncio
from websockets.exceptions import ConnectionClosed
import websockets
import json
from pong_entities import *
from environs import Env
from match_state import MatchState

env = Env()
env.read_env()

PLAYER_HEIGHT = 100
PLAYER_WIDTH = 40
PLAYER_SPEED = 600
BALL_RADIOUS = 10
BALL_SPEED = 400
BALL_START_DIRECTION = 30

class Socket:
    uri = f"ws://{env("BACKEND_HOST")}:{env("BACKEND_PORT")}/ws/game_loop/"
    ws: websockets.WebSocketClientProtocol = None
    
    @classmethod
    async def  connect_to_server(cls):
        while True:
            
            try:
                print("trying to connect to server")
                cls.ws = await websockets.connect(cls.uri)
                print("connected successfuly!!!")
                return
            except:
                await asyncio.sleep(2)
        raise ConnectionError("failed to connect with backend")

    @classmethod
    async def send_info(cls):
        tick = json.dumps({"action": "tick"})
        while True:
            if len(Game.balls) > 0:
                try:
                    await cls.ws.send(tick)
                except:
                    await cls.connect_to_server()
            await asyncio.sleep(Game.fps_time)
            
    @classmethod
    async def rcve_info(cls):
        while True:
            try:
                msg = await Socket.ws.recv()
                data: dict = json.loads(msg)
                print(f"data -> {data}")
                Actions.act(data)
                data.clear()
                msg = ""
            except ConnectionClosed:
                await cls.connect_to_server()
            except Exception as e:
                print(f"An error occurred: {e}")
                await asyncio.sleep(1)

class Game:
    balls: dict[int, Ball] = dict()
    fps_time = 1 / FPS

    @classmethod
    def move_balls(cls):
        for id, ball in cls.balls.items():
            ball.move(FPS)
            
    @classmethod
    def save_changes(cls):
        for id, match in Match.matches.items():
            entities = MatchState.get_entities(match.id)
            entities["ball"]["x"] = match.ball.x
            entities["ball"]["y"] = match.ball.y
            entities["ball"]["bounced"] = match.ball.bounced
            entities["player_left"]["x"] = match.player_left.x
            entities["player_left"]["y"] = match.player_left.y
            entities["player_left"]["points"] = match.player_right.hits
            entities["player_right"]["x"] = match.player_right.x
            entities["player_right"]["y"] = match.player_right.y
            entities["player_right"]["points"] = match.player_left.hits
            MatchState.set_entities(match.id, entities)
            
        
class Match:
    players: dict[int, Player] = dict()
    balls: dict[int, Ball] = dict()
    matches: dict[int, 'Match'] = dict()
    
    def __init__(self, data) -> None:
        self.started = False
        self.id = data["id"]
        self.max_scores = 5
        self.action = "coordinates"
        Match.matches[self.id] = self
        self._add_ball()
        self._add_player_left(data)
        self._add_player_right(data)
        
    def _add_ball(self):
        self.ball = Ball(
            [TABLE_WIDTH / 2, TABLE_HEIGHT / 2], 
            BALL_RADIOUS, 
            BALL_SPEED, 
            BALL_START_DIRECTION,
            self.id
        )
        Match.balls[self.id] = self.ball
        
    def _add_player_right(self, data):
        self.player_right = Player(
            [TABLE_WIDTH, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_RIGHT,
            data["player_right"]["username"]
        )
        Match.players[self.player_right.id] = self.player_right
        self.player_right.match_id = self.id
        self.ball.players["right"] = self.player_right
        
    def _add_player_left(self, data):
        self.player_left = Player(
            [0, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_LEFT,
            data["player_left"]["username"]
        )
        Match.players[self.player_left.id] = self.player_left
        self.player_left.match_id = self.id
        self.ball.players["left"] = self.player_left
    
    def start_match(self):
        Game.balls[self.id] = self.ball
        self.started = True
        
    def destroy(self):
        Match.matches.pop(self.id, None)
        Match.balls.pop(self.id, None)
        Match.players.pop(self.player_left.id, None)
        Match.players.pop(self.player_right.id, None)
        Game.balls.pop(self.id, None)
        
    @classmethod
    def find_match(cls, match_id):
        for id, match in cls.matches.items():
            if id == match_id:
                return match
        return None
    
    @classmethod
    def move_players(cls):
        for id, match in cls.matches.items():
            match = MatchState.get_entities(match.id)
            cls.move_player(match["player_left"])
            cls.move_player(match["player_right"])
                
    @classmethod
    def move_player(cls, player_data):
        player = Match.players[player_data["username"]]
        if player_data["move"] == "up":
            player.move_up()
        elif player_data["move"] == "down":
            player.move_down()
                
    @classmethod
    def verify_ended_matches(cls):
        for match_id, match in cls.matches.items():
            if match.player_right is None:
                continue
            total_scores = match.player_left.hits + match.player_right.hits
            if total_scores >= match.max_scores:
                match.action = "match_end"
                
    @classmethod
    async def end_matches(cls):
        for match in list(cls.matches.values()):
            if match.action != "match_end":
                continue
            match_data = MatchState.get(match.id)
            match_data["phase"] = "ended"
            match_data["player_left"]["winner"] = match.player_left.hits < match.player_right.hits
            match_data["player_right"]["winner"] = match.player_right.hits < match.player_left.hits
            MatchState.set(match.id, match_data)
            await Socket.ws.send(json.dumps({
                "action": "match_end",
                "match_id": match.id
            }))
            match.destroy()
            

class Actions:
    @classmethod
    def match_end(cls, data):
        pass
    
    @classmethod
    def start_matches(cls):
        matches = MatchState.get_ready()
        for data in matches:
            match = Match(data)
            MatchState.set_phase(data["id"], "running")
            match.start_match()
            
async def main():
    await Socket.connect_to_server()
        
    asyncio.create_task(Socket.send_info())
    asyncio.create_task(Socket.rcve_info())
    while True:
        Actions.start_matches()
        Game.move_balls()
        Match.move_players()
        Match.verify_ended_matches()
        Game.save_changes()
        await Match.end_matches()
        
        await asyncio.sleep(Game.fps_time)
        

asyncio.run(main())
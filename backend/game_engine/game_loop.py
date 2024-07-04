import asyncio
import json
from pong_entities import *
from typing import TypedDict
from environs import Env
import redis
from threading import Thread
import time

env = Env()
env.read_env()

PLAYER_HEIGHT = 100
PLAYER_WIDTH = 40
PLAYER_SPEED = 600
BALL_RADIOUS = 10
BALL_SPEED = 400
BALL_START_DIRECTION = 30

class PlayerMoveDataType(TypedDict):
    key: str
    player_id: str
    match_id: str
    action: str
    
redis_client = redis.StrictRedis(host=env("REDIS_HOST"), port=env("REDIS_PORT"), db=1)
    
class Info:
    match_event_payload = {
                    "type": "match.coordinates",
                    "text": "new"
                }

    @classmethod
    def emit_event(cls, group_name, event):
        data = {
            "group_name": group_name,
            "event": event
        }
        redis_client.lpush("emit_event", json.dumps(data))
    
    @classmethod
    def send(cls):
        print(f"fps_time: {Game.fps_time}")
        print("send started")
        while True:
            if len(Game.payload) > 0:
                redis_client.set("matches", json.dumps(Game.payload))
                print("send -> sent")
                cls.emit_event("match", {"type": "match.coordinates"})
            time.sleep(Game.fps_time)
            
    @classmethod
    def rcve(cls):
        print("rcve started")
        while True:
            try:
                data = redis_client.brpop("game_loop", 0)[1].decode()
                data: dict = json.loads(data)
                print(f"rcve -> {data}")
                cls.emit_event("match", {"type": "match.coordinates"})
                Actions.act(data)
                data.clear()
            except Exception as e:
                print(f"An error occurred: {e}")

class Game:
    balls: dict[int, Ball] = dict()
    fps_time = 1 / FPS
    payload = {}

    @classmethod
    def move_balls(cls):
        for id, ball in cls.balls.items():
            ball.move(FPS)
    @classmethod
    def create_payload(cls):
        cls.payload.clear()
        for match_id, match in Match.matches.items():
            if match.started == False:
                continue
            cls.payload[match_id] = {
                "ball": {
                    "x": match.ball.x,
                    "y": match.ball.y,
                    "bounced": match.ball.bounced
                    },
                "players": {
                    match.player_left.id: {
                        "x": match.player_left.x,
                        "y": match.player_left.y,
                        "pos": "left",
                        "points": match.player_right.hits
                    },
                    match.player_right.id: {
                        "x": match.player_right.x,
                        "y": match.player_right.y,
                        "pos": "right",
                        "points": match.player_left.hits
                    }
                },
                "action": match.action
            }

 
class Match:
    players: dict[int, Player] = dict()
    balls: dict[int, Ball] = dict()
    matches: dict[int, 'Match'] = dict()
    
    def __init__(self, data) -> None:
        self.started = False
        self.id = data["match_id"]
        self.max_scores = data["max_scores"]
        self.action = "coordinates"
        Match.matches[self.id] = self
        
        self.player_right: Player | None = None
        self.player_left = Player(
            [0, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_LEFT,
            data["player_id"]
        )
        Match.players[self.player_left.id] = self.player_left
        self.player_left.match_id = self.id
        
        self.ball = Ball(
            [TABLE_WIDTH / 2, TABLE_HEIGHT / 2], 
            BALL_RADIOUS, 
            BALL_SPEED, 
            BALL_START_DIRECTION,
            self.id
        )
        
        self.ball.players["left"] = self.player_left
        Match.balls[self.id] = self.ball
        
        
        
    def add_player_right(self, data):
        self.player_right = Player(
            [TABLE_WIDTH, TABLE_HEIGHT / 2],
            PLAYER_SPEED,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            Entity.PLAYER_RIGHT,
            data["player_id"]
        )
        Match.players[self.player_right.id] = self.player_right
        self.player_right.match_id = self.id
        self.ball.players["right"] = self.player_right
    
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
        for id, player in cls.players.items():
            if player.movement == "up":
                player.move_up()
            elif player.movement == "down":
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
    def destroy_matches(cls):
        for match in list(cls.matches.values()):
            if match.action != "match_end":
                continue
            match.destroy()

class Actions:
    @classmethod
    def new_match(cls, data):
        print("new_match()")
        match = Match(data)
        print(f"ball: x:{match.ball.x} y:{match.ball.y}")
        print(f"player_left: x:{match.player_left.x} y:{match.player_left.y}")
    
    @classmethod
    def player_move(cls, data: PlayerMoveDataType):
        player = Match.players[data["player_id"]]
        player.movement = data["key"]
        
    @classmethod
    def player_connect(cls, data):
        match = Match.find_match(data["match_id"])
        if not isinstance(match, Match):
            cls.new_match(data)
            return
        match.add_player_right(data)
        match.start_match()
    
    @classmethod
    def match_end(cls, data):
        pass
    
    @classmethod
    def act(cls, data):
        if data["action"] == "new_match":
            cls.new_match(data)
            return 
        if data["action"] == "player_connect":
            cls.player_connect(data)
            return 
        if data["action"] == "player_move":
            cls.player_move(data)
            return 


async def main():
    print("main loop started")
    while True:
        Game.move_balls()
        Match.move_players()
        Match.verify_ended_matches()
        Game.create_payload()
        Match.destroy_matches()

        await asyncio.sleep(Game.fps_time)

send_thread = Thread(target=Info.send)
rcve_thread = Thread(target=Info.rcve)

send_thread.start()
rcve_thread.start()

asyncio.run(main())

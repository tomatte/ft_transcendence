import time
import math
from pong_utils import *
from typing import List, Tuple
from enum import Enum

TABLE_WIDTH = 1280
TABLE_HEIGHT = 720
COLLISION_AREA = 50
FPS = 60

#how much the player can modify the direction of the ball; 
# MAX_LIMIT: 90; MIN_LIMIT: 1; RECOMMENDED: 30
PLAYER_BALL_DIR_MODIFIER = 30 

class FPSController:
    def __init__(self, fps):
        self.__frame_duration = 1.0 / fps
        self.__last_time = time.time()
        self.fps = fps
    
    def tick(self):
        current_time = time.time()
        elapsed_time = current_time - self.__last_time
        sleep_time = self.__frame_duration - elapsed_time
        
        if sleep_time > 0:
            time.sleep(sleep_time)
            
        self.__last_time = time.time()
        
    
    def isNewFrame(self):
        current_time = time.time()
        elapsed_time = current_time - self.__last_time
        sleep_time = self.__frame_duration - elapsed_time
        
        if sleep_time > 0:
            return False
        
        self.__last_time = time.time()
        return True
    
class Entity(Enum):
    NONE = 0
    PLAYER_LEFT = 1
    PLAYER_RIGHT = 2
    
    TABLE_TOP = 3
    TABLE_BOTTOM = 4
    TABLE_LEFT = 5
    TABLE_RIGHT = 6
    
    
class Table:
    width = TABLE_WIDTH = 1280
    height = TABLE_HEIGHT = 720
    
    top_side = {
        "bottom_left": (-COLLISION_AREA, 0),
        "top_right": (TABLE_WIDTH + COLLISION_AREA, -COLLISION_AREA)
    }
    
    bottom_side = {
        "bottom_left": (-COLLISION_AREA, TABLE_HEIGHT + COLLISION_AREA),
        "top_right": (TABLE_WIDTH + COLLISION_AREA, TABLE_HEIGHT)
    }

    left_side = {
        "bottom_left": (-COLLISION_AREA, TABLE_HEIGHT),
        "top_right": (0, 0)
    }

    right_side = {
        "bottom_left": (TABLE_WIDTH, TABLE_HEIGHT),
        "top_right": (TABLE_WIDTH + COLLISION_AREA, 0)
    }
    
    


class Rectangle:
    def __init__(self, position: Tuple[float, float], speed: float, direction: int):
        self.speed = speed
        self.dir = direction
        self.x = position[0]
        self.y = position[1]

    def move(self, fps):
        dir_rad = math.radians(self.dir)

        vx = self.speed * math.cos(dir_rad)
        vy = self.speed * math.sin(dir_rad)
        
        dt = 1 / fps
        
        self.x += vx * dt
        self.y += vy * dt
        

class Player(Rectangle):
    def __init__(self, position: Tuple[float, float], speed: float, width: int, height: int, entity_type: Entity, id: int):
        super().__init__(position, speed, 90)
        self.width = width
        self.height = height
        self.hits = 0
        self.entity_type = entity_type
        self.id = id
        # self.up_line = ((position[0], position[1] - height / 2), (self.top_right))
        # self.bottom_line = ((self.bottom_left), (position[0] + width / 2, position[1] + height / 2))

    def hit(self):
        self.hits += 1

    def get_bottom_left(self):
        if self.entity_type == Entity.PLAYER_LEFT:
            return (self.x, self.y + self.height / 2)
        else:
            return (self.x - self.width, self.y + self.height / 2)
        
    def get_top_left(self):
        if self.entity_type == Entity.PLAYER_LEFT:
            return (self.x, self.y - self.height / 2)
        else:
            return (self.x - self.width, self.y - self.height / 2)
        
    def get_top_right(self):
        if self.entity_type == Entity.PLAYER_LEFT:
            return (self.x + self.width, self.y - self.height / 2)
        else:
            return (self.x, self.y - self.height / 2)
        
    def get_bottom_right(self):
        if self.entity_type == Entity.PLAYER_LEFT:
            return (self.x + self.width, self.y + self.height / 2)
        else:
            return (self.x, self.y + self.height / 2)
        
    def move_up(self):
        dir_rad = math.radians(270)

        vy = self.speed * math.sin(dir_rad)
        
        dt = 1 / FPS
        
        self.y += vy * dt
    
    def move_down(self):
        dir_rad = math.radians(90)

        vy = self.speed * math.sin(dir_rad)
        
        dt = 1 / FPS
        
        self.y += vy * dt
    

type PlayersType = Tuple[Player, Player]

class Ball(Rectangle):
    def __init__(self, position: List[float], radious: int, speed: float, direction: int, id: int):
        super().__init__(position, speed, direction)
        self.type = "ball"
        self.radious = radious
        self.last_collided = Entity.NONE
        self.players: PlayersType = ()
        self.id = id

    def set_players(self, players: PlayersType):
        self.players = players
        
        
    def change_direction_by_player(self, player: Player):
        pixel_distance = self.y - player.y
        direction = (PLAYER_BALL_DIR_MODIFIER / (player.height / 2)) * pixel_distance
        #when direction is negative the ball hit the player's top_side, then ball will go upward
        if player.entity_type == Entity.PLAYER_RIGHT:
            if direction < 0:
                direction = 180 + (-direction)
            else:
                direction = 180 - direction
            print(f"direction: {direction}")
        self.dir = direction
        
    def is_colliding(self, bottom_left, top_right):
        if (is_point_inside_rect(bottom_left, top_right, [self.x, self.y + self.radious])):
            return True
        if (is_point_inside_rect(bottom_left, top_right, [self.x + self.radious, self.y - self.radious])):
            return True
        if (is_point_inside_rect(bottom_left, top_right, [self.x + self.radious, self.y])):
            return True
        if (is_point_inside_rect(bottom_left, top_right, [self.x - self.radious, self.y])):
            return True
        return False
    
    def verify_collision_player(self):
        for player in self.players:
            if self.last_collided != player.entity_type and self.is_colliding(player.get_bottom_left(), player.get_top_right()):
                print("player defended")
                self.last_collided = player.entity_type
                self.change_direction_by_player(player)
                return True
        return False

    def verify_collision_wall(self):
        #table top side
        if (self.last_collided != Entity.TABLE_TOP and self.is_colliding(Table.top_side["bottom_left"], Table.top_side["top_right"])):
            self.last_collided = Entity.TABLE_TOP
            self.dir = horizontal_wall_bounce(self.dir)
        #table bottom side
        if (self.last_collided != Entity.TABLE_BOTTOM and self.is_colliding(Table.bottom_side["bottom_left"], Table.bottom_side["top_right"])):
            self.last_collided = Entity.TABLE_BOTTOM
            self.dir = horizontal_wall_bounce(self.dir)
        #table left side
        if (self.last_collided != Entity.TABLE_LEFT and self.is_colliding(Table.left_side["bottom_left"], Table.left_side["top_right"])):
            self.last_collided = Entity.TABLE_LEFT
            self.players[0].hit()
            # print(f"player1 hits: {self.players[0].hits}")
            self.dir = vertical_wall_bounce(self.dir)
        #table right side
        if (self.last_collided != Entity.TABLE_RIGHT and self.is_colliding(Table.right_side["bottom_left"], Table.right_side["top_right"])):
            self.last_collided = Entity.TABLE_RIGHT
            self.dir = vertical_wall_bounce(self.dir)
    
    def move(self, fps):
        self.verify_collision_wall()
        self.verify_collision_player()
        super().move(fps)

    # def verify_collision(self):
    #     for player in self.players:
            
                

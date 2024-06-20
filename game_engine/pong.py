import time
import math
import utils
from typing import List, Tuple

TABLE_WIDTH = 1280
TABLE_HEIGHT = 720
BOX = 20
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


class Rectangle:
    def __init__(self, position: List[float], speed: float, direction: int):
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
    def __init__(self, position: List[float], speed: float, width: int, height: int):
        super().__init__(position, speed, 90)
        self.width = width
        self.height = height
        self.hits = 0
        # self.up_line = ((position[0], position[1] - height / 2), (self.top_right))
        # self.bottom_line = ((self.bottom_left), (position[0] + width / 2, position[1] + height / 2))

    def hit(self):
        self.hits += 1

    def get_bottom_left(self):
        return (self.x, self.y + self.height / 2)
    def get_top_right(self):
        return (self.x + self.width, self.y - self.height / 2)
    def get_bottom_right(self):
        return (self.x + self.width, self.y + self.height / 2)
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
    

class Ball(Rectangle):
    def __init__(self, position: List[float], radious: int, speed: float, direction: int):
        super().__init__(position, speed, direction)
        self.type = "ball"
        self.radious = radious

    def set_players(self, players: List[Player]):
        self.players = players
        
    def change_direction_by_player(self, player: Player):
        pixel_distance = self.y - player.y
        direction = (PLAYER_BALL_DIR_MODIFIER / (player.height / 2)) * pixel_distance
        #when direction is negative the ball hit the player's top_side, then ball will go upward
        if direction < 0:
            direction += 360
        self.dir = direction
    
    def verify_collision_player(self):
        for player in self.players:
            if self.is_colliding(player.get_bottom_left(), player.get_top_right()):
                print("player defended")
                self.change_direction_by_player(player)
                return True
        return False

    def verify_collision_wall(self):
        #table up side
        if (self.is_colliding([-BOX, 0], [TABLE_WIDTH + BOX, -BOX])):
            self.dir = utils.horizontal_wall_bounce(self.dir)
        #table bottom side
        if (self.is_colliding([-BOX, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, TABLE_HEIGHT])):
            self.dir = utils.horizontal_wall_bounce(self.dir)
        #table left side
        if (self.is_colliding([-BOX, TABLE_HEIGHT + BOX], [0, -BOX])):
            self.players[0].hit()
            print(f"player1 hits: {self.players[0].hits}")
            self.dir = utils.vertical_wall_bounce(self.dir)
        #table right side
        if (self.is_colliding([TABLE_WIDTH, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, -BOX])):
            self.dir = utils.vertical_wall_bounce(self.dir)

    def is_colliding(self, bottom_left, top_right):
        if (utils.is_point_inside_rect(bottom_left, top_right, [self.x, self.y + self.radious])):
            return True
        if (utils.is_point_inside_rect(bottom_left, top_right, [self.x + self.radious, self.y - self.radious])):
            return True
        if (utils.is_point_inside_rect(bottom_left, top_right, [self.x + self.radious, self.y])):
            return True
        if (utils.is_point_inside_rect(bottom_left, top_right, [self.x - self.radious, self.y])):
            return True
        return False
    
    def move(self, fps):
        self.verify_collision_wall()
        self.verify_collision_player()
        super().move(fps)

    # def verify_collision(self):
    #     for player in self.players:
            
                

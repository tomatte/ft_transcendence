import time
import math
import utils
from typing import List, Tuple

TABLE_WIDTH = 1280
TABLE_HEIGHT = 720
BOX = 20
FPS = 60

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
    def __init__(self, position: List[float], speed: float):
        super().__init__(position, speed, 90)
    
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
    
    def is_colliding():
        pass
        

class Ball(Rectangle):
    def __init__(self, position: List[float], radious: int, speed: float, direction: int):
        super().__init__(position, speed, direction)
        self.type = "ball"
        self.radious = radious

    def set_players(self, players: List[Player]):
        self.players = players
    
    def is_colliding_with_player(self):
        player = self.players[0]
        if (utils.is_point_inside_rect([player.x, player.y + 50], [player.x + 20, player.y - 50], [self.x, self.y + self.radious])):
            return True
        if (utils.is_point_inside_rect([player.x, player.y + 50], [player.x + 20, player.y - 50], [self.x + self.radious, self.y - self.radious])):
            return True
        if (utils.is_point_inside_rect([player.x, player.y + 50], [player.x + 20, player.y - 50], [self.x + self.radious, self.y])):
            return True
        if (utils.is_point_inside_rect([player.x, player.y + 50], [player.x + 20, player.y - 50], [self.x - self.radious, self.y])):
            return True
        return False

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
        #table up side
        if (self.is_colliding([-BOX, 0], [TABLE_WIDTH + BOX, -BOX])):
            self.dir = utils.horizontal_wall_bounce(self.dir)
        #table left side
        if (self.is_colliding([-BOX, TABLE_HEIGHT + BOX], [0, -BOX])):
            print("player1 lost")
            self.dir = utils.vertical_wall_bounce(self.dir)
        #table bottom side
        if (self.is_colliding([-BOX, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, TABLE_HEIGHT])):
            self.dir = utils.horizontal_wall_bounce(self.dir)
        #table right side
        if (self.is_colliding([TABLE_WIDTH, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, -BOX])):
            self.dir = utils.vertical_wall_bounce(self.dir)
        if self.is_colliding_with_player():
            print("player defended")
            self.dir = utils.vertical_wall_bounce(self.dir)
        super().move(fps)

    # def verify_collision(self):
    #     for player in self.players:
            
                

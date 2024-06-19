import time
import math
import utils
from typing import List, Tuple
import pygame

TABLE_WIDTH = 1280
TABLE_HEIGHT = 720
BOX = 20

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
        

class Ball(Rectangle):
    def __init__(self, position: List[float], radious: int, speed: float, direction: int):
        super().__init__(position, speed, direction)
        self.type = "ball"
        self.radious = radious

    def set_collision(self, items):
        self.items = items

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
            self.dir = utils.vertical_wall_bounce(self.dir)
        #table bottom side
        if (self.is_colliding([-BOX, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, TABLE_HEIGHT])):
            self.dir = utils.horizontal_wall_bounce(self.dir)
        #table right side
        if (self.is_colliding([TABLE_WIDTH, TABLE_HEIGHT + BOX], [TABLE_WIDTH + BOX, -BOX])):
            self.dir = utils.vertical_wall_bounce(self.dir)
        super().move(fps)

    def verify_collision(self):
        for item in self.items:
            if (isinstance(item, Rectangle)):
                print(item.type)
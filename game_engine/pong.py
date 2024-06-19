import time
import math
from typing import List

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


import time

class FPSController:
    def __init__(self, fps):
        self.__frame_duration = 1.0 / fps
        self.__last_time = time.time()
    
    def tick(self):
        current_time = time.time()
        elapsed_time = current_time - self.__last_time
        sleep_time = self.__frame_duration - elapsed_time
        
        if sleep_time > 0:
            time.sleep(sleep_time)
        
        self.__last_time = time.time()
        
class Ball:
    def __init__(self) -> None:
        pass
    obj = None
    position = [100, 100]
    speed = None
    direction = [1, 1]
    
    
    def move():
        pass

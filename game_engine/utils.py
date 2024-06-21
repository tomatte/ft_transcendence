from typing import List, Tuple
import math

def is_point_on_line(pl1: List[int | float], pl2: List[int | float], p: List[int | float]):
    # If the line is vertical (x1 == x2), handle it separately
    if pl1[0] == pl2[0]:
        return p[0] == pl1[0]
    else:
        # Calculate the slope (m) and intercept (b)
        m = (pl2[1] - pl1[1]) / (pl2[0] - pl1[0])
        b = pl1[1] - m * pl1[0]
        # Check if the point (px, py) satisfies the line equation y = mx + b
        return p[1] == m * p[0] + b
    
    
def is_point_inside_rect(bottom_left, top_right, p):
    x1 = bottom_left[0]
    x2 = top_right[0]
    y1 = bottom_left[1]
    y2 = top_right[1]
    px = p[0]
    py = p[1]
    return px > x1 and px < x2 and py < y1 and py > y2

def vertical_wall_bounce(angle):
    return (180 - angle) % 360

def horizontal_wall_bounce(angle):
    new_angle = (-angle) % 360
    return new_angle if new_angle >= 0 else (new_angle + 360)
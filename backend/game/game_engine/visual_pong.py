from typing import List, Tuple
import pygame
from .pong import TABLE_HEIGHT, TABLE_WIDTH, FPSController, Player, Ball, FPS, Table, Entity

width = TABLE_WIDTH
height = TABLE_HEIGHT

fps = FPSController(60)

#----------------------PY GAME---------------------
pygame.init()
screen = pygame.display.set_mode((width, height))
#----------------------PY GAME---------------------

ball = Ball([width / 2, height / 2], 30, 900, 360)

player_left = Player([0, height / 2], 500, 20, 150, Entity.PLAYER_LEFT)
player_right = Player([Table.width, height / 2], 500, 20, 150, Entity.PLAYER_RIGHT)

ball.set_players([player_left, player_right])

rect = pygame.Rect(0, 0, 20, 100)

done = False
while not done:
    fps.tick()
    screen.fill("black")
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
            
    if event.type == pygame.KEYDOWN:
        if event.key == pygame.K_UP:
            player_left.move_up()
            player_right.move_up()
        if event.key == pygame.K_DOWN:
            player_left.move_down()
            player_right.move_down()
            
    # pygame.draw.line(screen, [0, 0, 150], player_left.get_top_right(), player_left.get_bottom_right())
    # pygame.draw.line(screen, [0, 0, 150], player_right.get_top_left(), player_right.get_bottom_left())
    
    pygame.draw.rect(screen, [0, 0, 150], pygame.Rect(
        player_left.x, 
        player_left.y - player_left.height / 2, 
        player_left.width, 
        player_left.height
    ))
    pygame.draw.rect(screen, [0, 0, 150], pygame.Rect(
        player_right.x - player_right.width, 
        player_right.y - player_right.height / 2, 
        player_right.width, 
        player_right.height
    ))


    # rect.move(fps.fps)
    # rect2.move(fps.fps)
    ball.move(fps.fps)
    # ball.calc_wall_collision([0, 0], [1280, 0])

    pygame.draw.circle(screen, [0, 0, 150], [ball.x, ball.y], 30)

    pygame.display.flip()
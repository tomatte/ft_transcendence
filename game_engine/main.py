import pong
import pygame

width = pong.TABLE_WIDTH
height = pong.TABLE_HEIGHT

fps = pong.FPSController(60)

#----------------------PY GAME---------------------
pygame.init()
screen = pygame.display.set_mode((width, height))
#----------------------PY GAME---------------------

ball = pong.Ball([width / 2, height / 2], 30, 900, 360)

player_left = pong.Player([0, height / 2], 500, 20, 150, pong.Entity.PLAYER_LEFT)
player_right = pong.Player([pong.Table.width, height / 2], 500, 20, 150, pong.Entity.PLAYER_RIGHT)

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
            
    pygame.draw.line(screen, [0, 0, 150], player_left.get_top_right(), player_left.get_bottom_right())
    pygame.draw.line(screen, [0, 0, 150], player_right.get_top_left(), player_right.get_bottom_left())
    

    # rect.move(fps.fps)
    # rect2.move(fps.fps)
    ball.move(fps.fps)
    # ball.calc_wall_collision([0, 0], [1280, 0])

    pygame.draw.circle(screen, [0, 0, 150], [ball.x, ball.y], 30)

    pygame.display.flip()
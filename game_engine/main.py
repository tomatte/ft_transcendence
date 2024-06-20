import pong
import pygame

width = pong.TABLE_WIDTH
height = pong.TABLE_HEIGHT

fps = pong.FPSController(60)

#----------------------PY GAME---------------------
pygame.init()
screen = pygame.display.set_mode((width, height))
#----------------------PY GAME---------------------

ball = pong.Ball([width / 2, height / 2], 30, 900, 30)

player1 = pong.Player([0, height / 2], 500, 20, 100)

ball.set_players([player1])

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
            player1.move_up()
        if event.key == pygame.K_DOWN:
            player1.move_down()
            
    pygame.draw.line(screen, [0, 0, 150], player1.get_top_right(), player1.get_bottom_right())
    

    # rect.move(fps.fps)
    # rect2.move(fps.fps)
    ball.move(fps.fps)
    # ball.calc_wall_collision([0, 0], [1280, 0])

    pygame.draw.circle(screen, [0, 0, 150], [ball.x, ball.y], 30)

    pygame.display.flip()
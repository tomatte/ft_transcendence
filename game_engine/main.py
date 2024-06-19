import pong
import pygame

width = pong.TABLE_WIDTH
height = pong.TABLE_HEIGHT

fps = pong.FPSController(60)

#----------------------PY GAME---------------------
pygame.init()
screen = pygame.display.set_mode((width, height))
#----------------------PY GAME---------------------

ball = pong.Ball([width / 2, height / 2], 30, 900, 0)
ball2 = pong.Ball([width / 2, height / 2], 45, 900, 0)
ball3 = pong.Ball([width / 2, height / 2], 60, 900, 0)
ball4 = pong.Ball([width / 2, height / 2], 75, 900, 0)

rec = pygame.Rect(10, 10, 40, 40)

done = False
while not done:
    fps.tick()
    screen.fill("black")
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
    
    # rect.move(fps.fps)
    # rect2.move(fps.fps)
    ball.move(fps.fps)
    ball2.move(fps.fps)
    ball3.move(fps.fps)
    ball4.move(fps.fps)
    # ball.calc_wall_collision([0, 0], [1280, 0])

    pygame.draw.circle(screen, [0, 0, 150], [ball.x, ball.y], 30)
    pygame.draw.circle(screen, [0, 0, 150], [ball2.x, ball2.y], 30)
    pygame.draw.circle(screen, [0, 0, 150], [ball3.x, ball3.y], 30)
    pygame.draw.circle(screen, [0, 0, 150], [ball4.x, ball4.y], 30)
            
    pygame.display.flip()
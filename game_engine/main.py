import pong
import pygame

width = 1280
height = 720

fps = pong.FPSController(60)
rect = pong.Rectangle([width / 2, height / 2], 30, 90)
rect2 = pong.Rectangle([width / 2, height / 2], 50, 180)
rect3 = pong.Rectangle([width / 2, height / 2], 70, 270)

#----------------------PY GAME---------------------
pygame.init()
screen = pygame.display.set_mode((width, height))
#----------------------PY GAME---------------------

done = False
while not done:
    fps.tick()
    screen.fill("black")
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
    
    # rect.move(fps.fps)
    # rect2.move(fps.fps)
    rect3.move(fps.fps)

    pygame.draw.circle(screen, [0, 0, 150], [rect.x, rect.y], 30)
    pygame.draw.circle(screen, [0, 0, 150], [rect2.x, rect2.y], 30)
    pygame.draw.circle(screen, [0, 0, 150], [rect3.x, rect3.y], 30)
            
    pygame.display.flip()
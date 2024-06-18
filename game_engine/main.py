import pong

done = False

fps = pong.FPSController(60)

while not done:
    fps.tick()
    print("hello")
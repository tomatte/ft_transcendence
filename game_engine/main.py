import pong


fps20 = pong.FPSController(20)
fps30 = pong.FPSController(30)
fps60 = pong.FPSController(60)
fps5 = pong.FPSController(5)

done = False
while not done:
    if fps20.isNewFrame():
        print("20")
    if fps5.isNewFrame():
        print("5")
    if fps30.isNewFrame():
        print("30")
    if fps60.isNewFrame():
        print("60")
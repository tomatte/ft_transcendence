import asyncio
from multiprocessing import Process

async def loop(num):
    while True:
        await asyncio.sleep(2)
        print(num)
        
def f(num):
    asyncio.run(loop(num))


if __name__ == '__main__':
    num = "dois"
    p = Process(target=f, args=(num,))
    p.start()
    f("um")
    p.join()
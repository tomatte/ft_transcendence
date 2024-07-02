import asyncio
import websockets

async def main():
    uri = "ws://localhost:8000/britney/"
    websocket = await websockets.connect(uri)
    await websocket.send("hello")
    message = await websocket.recv()
    print(message)
    
    while True:
        msg = await websocket.recv()
        print(msg)
        
asyncio.run(main())
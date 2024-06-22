from django.shortcuts import render
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import json


# Create your views here.
class XablauConsumer(AsyncWebsocketConsumer):
	index = 0

	async def connect(self):
		await self.accept()
		XablauConsumer.index += 1
		payload = {
			"id": XablauConsumer.index,
			"method": "connect"
		}
		await self.send(json.dumps(payload))

	async def disconnect(self, close_code):
		print(f"close_code: {close_code}")
		pass

	async def receive(self, text_data):
		data = json.loads(text_data)
		payload = {"method": "receive"}
		if data["key"] == "Up":
			payload["action"] = f"player {data["id"]} moved up!"
			await self.send(json.dumps(payload))
		elif data["key"] == "Down":
			payload["action"] = f"player {data["id"]} moved down!"
			await self.send(json.dumps(payload))
	
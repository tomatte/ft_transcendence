from celery import shared_task
from channels.layers import get_channel_layer
import asyncio

channel_layer = get_channel_layer()

async def emit_group_event(group_name, event: dict):
    await channel_layer.group_send(group_name, event)
    
async def emit_channel_event(channel_name, event: dict):
    await channel_layer.send(channel_name, event)

@shared_task
def emit_group_event_task(group_name, event: dict):
    asyncio.run(emit_group_event(group_name, event))
    
@shared_task
def emit_channel_event_task(channel_name, event: dict):
    asyncio.run(emit_channel_event(channel_name, event))
    
class Task:
    @classmethod
    def send(cls, channel_name, event, seconds):
        args = (channel_name, event)
        emit_channel_event_task.apply_async(args=args, countdown=seconds)
        
    @classmethod
    def send_group(cls, group_name, event, seconds):
        args = (group_name, event)
        emit_group_event_task.apply_async(args=args, countdown=seconds)
from celery import shared_task
from channels.layers import get_channel_layer
import asyncio

channel_layer = get_channel_layer()

async def emit_group_event(group_name, event: dict):
    await channel_layer.group_send(group_name, event)

@shared_task
def emit_group_event_task(group_name, event: dict):
    asyncio.run(emit_group_event(group_name, event))
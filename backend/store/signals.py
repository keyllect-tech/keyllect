import requests
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from django.conf import settings

# Signals are intentionally left blank as Telegram notification is handled in serializers.py

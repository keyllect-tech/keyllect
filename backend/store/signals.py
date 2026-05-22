import requests
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from django.conf import settings

@receiver(post_save, sender=Order)
def send_telegram_notification(sender, instance, created, **kwargs):
    if created:
        token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        
        if not token or not chat_id:
            return

        items = instance.items.all()
        items_text = "\n".join([f"• {item.product.name} × {item.quantity}" for item in items])
        
        text = f"""
🛒 *Новый заказ #{instance.order_number}*

👤 *Клиент:* {instance.client_name}
📞 *Телефон:* {instance.phone}
{f"✈️ *Telegram:* @{instance.telegram}" if instance.telegram else ""}
📍 *Адрес:* {instance.address}

📦 *Товары:*
{items_text}

💰 *Сумма:* {instance.total_amount:,.0f} сум

🕒 *Дата заказа:* {instance.created_at.strftime('%d.%m.%Y %H:%M')}
        """
        
        try:
            requests.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
            )
        except Exception as e:
            print(f"Error sending telegram message: {e}")

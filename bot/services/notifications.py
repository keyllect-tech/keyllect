import logging
from aiogram import Bot
from config.config import settings

logger = logging.getLogger(__name__)

# Translate status keys for notifications
STATUS_LABELS = {
    'NEW': '🆕 Новый',
    'CONFIRMED': '✅ Подтвержден',
    'PROCESSING': '⚙️ В обработке',
    'SHIPPING': '🚚 Доставляется',
    'COMPLETED': '🏁 Завершен',
    'CANCELED': '❌ Отменен'
}

async def notify_admins_new_order(bot: Bot, order: dict):
    message_text = (
        f"🚨 <b>Новый заказ #{order['id']}!</b>\n\n"
        f"👤 Покупатель: {order['full_name']}\n"
        f"📞 Телефон: {order['phone']}\n"
        f"📍 Адрес: {order['address']}\n"
        f"🛍️ Товар: <b>{order['product_name']}</b>\n"
        f"💵 Сумма: {order['product_price']:,} сум\n"
    )
    
    for admin_id in settings.ADMIN_IDS:
        try:
            await bot.send_message(chat_id=admin_id, text=message_text, parse_mode="HTML")
        except Exception as e:
            logger.error(f"Failed to send admin notification to {admin_id}: {e}")

async def notify_user_status_change(bot: Bot, user_id: int, order_id: int, status: str, product_name: str):
    status_text = STATUS_LABELS.get(status, status)
    message_text = (
        f"🔔 <b>Обновление статуса заказа #{order_id}!</b>\n\n"
        f"Товар: <b>{product_name}</b>\n"
        f"Текущий статус: <b>{status_text}</b>\n\n"
        f"Спасибо, что выбираете Keyllect! 🤍"
    )
    try:
        await bot.send_message(chat_id=user_id, text=message_text, parse_mode="HTML")
    except Exception as e:
        logger.error(f"Failed to send status update to user {user_id}: {e}")

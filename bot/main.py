import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config.config import settings
from database.connection import init_db
from handlers.client import client_router
from handlers.admin import admin_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

async def main():
    # Check bot token configuration
    if not settings.BOT_TOKEN or settings.BOT_TOKEN == "123456789:PlaceholderBotToken":
        logger.error("Error: BOT_TOKEN is empty or has a placeholder value in .env file!")
        print("\n[CONFIG ERROR] Please configure a valid BOT_TOKEN in the bot/.env file before running.")
        sys.exit(1)

    # Initialize Database
    logger.info("Initializing database...")
    init_db()

    # Initialize Bot & Dispatcher
    bot = Bot(token=settings.BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())

    # Register Routers
    # Register admin_router first to intercept admin commands/callbacks correctly
    dp.include_router(admin_router)
    dp.include_router(client_router)

    logger.info("Starting Telegram Bot long polling...")
    try:
        # Delete webhook to ensure polling works cleanly
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot stopped.")

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    BOT_TOKEN: str = os.getenv("BOT_TOKEN", "")
    
    # Parse list of admins
    admin_ids_raw = os.getenv("ADMIN_IDS", "")
    ADMIN_IDS: list[int] = [
        int(x.strip()) for x in admin_ids_raw.split(",") if x.strip().isdigit()
    ]
    
    MANAGER_USERNAME: str = os.getenv("MANAGER_USERNAME", "keyllect_manager")
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "keyllect_bot.db")

settings = Settings()

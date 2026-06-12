import sqlite3
from config.config import settings

def get_db_connection():
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Create products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        photo TEXT,
        is_sale INTEGER DEFAULT 0,
        old_price REAL,
        in_stock INTEGER DEFAULT 1
    )
    """)
    
    # Create orders table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        status TEXT DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
    """)
    
    # Create favorites table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
    """)
    
    conn.commit()
    conn.close()

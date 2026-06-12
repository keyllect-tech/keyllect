from database.connection import get_db_connection

class ProductRepository:
    @staticmethod
    def get_all(category: str = None) -> list:
        conn = get_db_connection()
        cursor = conn.cursor()
        if category:
            cursor.execute("SELECT * FROM products WHERE category = ?", (category,))
        else:
            cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def get_by_id(product_id: int) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def search_by_name(query: str) -> list:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE name LIKE ?", (f"%{query}%",))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create(category: str, name: str, description: str, price: float, photo: str, is_sale: int = 0, old_price: float = None, in_stock: int = 1) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO products (category, name, description, price, photo, is_sale, old_price, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (category, name, description, price, photo, is_sale, old_price, in_stock)
        )
        product_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return product_id

    @staticmethod
    def update_price(product_id: int, price: float, is_sale: int = 0, old_price: float = None) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE products SET price = ?, is_sale = ?, old_price = ? WHERE id = ?",
            (price, is_sale, old_price, product_id)
        )
        updated = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return updated

    @staticmethod
    def update_stock(product_id: int, in_stock: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET in_stock = ? WHERE id = ?", (in_stock, product_id))
        updated = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return updated

    @staticmethod
    def delete(product_id: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        deleted = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return deleted

    @staticmethod
    def count() -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        conn.close()
        return count


class OrderRepository:
    @staticmethod
    def create(user_id: int, full_name: str, phone: str, address: str, product_id: int) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (user_id, full_name, phone, address, product_id, status) VALUES (?, ?, ?, ?, ?, 'NEW')",
            (user_id, full_name, phone, address, product_id)
        )
        order_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return order_id

    @staticmethod
    def get_by_user(user_id: int) -> list:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT o.*, p.name as product_name, p.price as product_price 
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def get_by_id(order_id: int) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT o.*, p.name as product_name, p.price as product_price 
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.id = ?
        """, (order_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_all(status: str = None) -> list:
        conn = get_db_connection()
        cursor = conn.cursor()
        if status:
            cursor.execute("""
                SELECT o.*, p.name as product_name 
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.status = ?
                ORDER BY o.created_at DESC
            """, (status,))
        else:
            cursor.execute("""
                SELECT o.*, p.name as product_name 
                FROM orders o
                JOIN products p ON o.product_id = p.id
                ORDER BY o.created_at DESC
            """)
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def update_status(order_id: int, status: str) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        updated = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return updated

    @staticmethod
    def count(status: str = None) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        if status:
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = ?", (status,))
        else:
            cursor.execute("SELECT COUNT(*) FROM orders")
        count = cursor.fetchone()[0]
        conn.close()
        return count

    @staticmethod
    def count_clients() -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(DISTINCT user_id) FROM orders")
        count = cursor.fetchone()[0]
        conn.close()
        return count


class FavoriteRepository:
    @staticmethod
    def add(user_id: int, product_id: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO favorites (user_id, product_id) VALUES (?, ?)", (user_id, product_id))
            conn.commit()
            success = True
        except sqlite3.IntegrityError:
            success = False
        conn.close()
        return success

    @staticmethod
    def remove(user_id: int, product_id: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM favorites WHERE user_id = ? AND product_id = ?", (user_id, product_id))
        removed = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return removed

    @staticmethod
    def is_favorite(user_id: int, product_id: int) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ?", (user_id, product_id))
        row = cursor.fetchone()
        conn.close()
        return row is not None

    @staticmethod
    def get_favorites(user_id: int) -> list:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.* 
            FROM favorites f
            JOIN products p ON f.product_id = p.id
            WHERE f.user_id = ?
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]


class UserRepository:
    @staticmethod
    def save(user_id: int, username: str = None, first_name: str = None) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT OR REPLACE INTO users (id, username, first_name) VALUES (?, ?, ?)",
                (user_id, username, first_name)
            )
            conn.commit()
            success = True
        except Exception:
            success = False
        conn.close()
        return success

    @staticmethod
    def get_all_ids() -> list[int]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users")
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]


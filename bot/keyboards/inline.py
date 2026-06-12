from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from config.config import settings

def get_main_menu_kb(is_admin: bool = False) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(text="🛒 Каталог", callback_data="catalog"), InlineKeyboardButton(text="⭐ Избранное", callback_data="favorites")],
        [InlineKeyboardButton(text="📦 Мои заказы", callback_data="my_orders"), InlineKeyboardButton(text="🔍 Поиск", callback_data="search_products")],
        [InlineKeyboardButton(text="ℹ️ О магазине", callback_data="about"), InlineKeyboardButton(text="📞 Контакты", callback_data="contacts")]
    ]
    if is_admin:
        buttons.append([InlineKeyboardButton(text="🛠️ Админ-панель", callback_data="admin_panel")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_categories_kb() -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton(text="⌨️ Клавиатуры", callback_data="cat_keyboards"), InlineKeyboardButton(text="🖱️ Мышки", callback_data="cat_mice")],
        [InlineKeyboardButton(text="🎧 Наушники", callback_data="cat_headphones"), InlineKeyboardButton(text="🟪 Коврики", callback_data="cat_pads")],
        [InlineKeyboardButton(text="🔌 Другие аксессуары", callback_data="cat_other")],
        [InlineKeyboardButton(text="⬅️ Главное меню", callback_data="main_menu")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_product_detail_kb(
    product_id: int, 
    category: str, 
    is_fav: bool, 
    in_stock: bool, 
    is_admin: bool = False, 
    index: int = 0, 
    total: int = 1,
    search_query: str = None
) -> InlineKeyboardMarkup:
    buttons = []
    
    # Navigation row
    nav_row = []
    # Determine back/next callback path
    prefix = f"search_{search_query}" if search_query else f"cat_{category}"
    if total > 1:
        prev_idx = (index - 1) % total
        next_idx = (index + 1) % total
        nav_row.append(InlineKeyboardButton(text="⬅️", callback_data=f"nav_{prefix}_{prev_idx}"))
        nav_row.append(InlineKeyboardButton(text=f"{index + 1}/{total}", callback_data="noop"))
        nav_row.append(InlineKeyboardButton(text="➡️", callback_data=f"nav_{prefix}_{next_idx}"))
        buttons.append(nav_row)
        
    # Actions row
    action_row = []
    fav_text = "❤️ В избранном" if is_fav else "🖤 В избранное"
    fav_callback = f"fav_del_{product_id}" if is_fav else f"fav_add_{product_id}"
    if search_query:
        # Append search query to preserve state
        fav_callback += f"_s_{search_query}"
    action_row.append(InlineKeyboardButton(text=fav_text, callback_data=fav_callback))
    
    if in_stock:
        action_row.append(InlineKeyboardButton(text="🛍️ Заказать", callback_data=f"order_{product_id}"))
    buttons.append(action_row)
    
    # Admin controls
    if is_admin:
        admin_row1 = [
            InlineKeyboardButton(text="✏️ Цена", callback_data=f"adm_price_{product_id}"),
            InlineKeyboardButton(text="📦 Сток: " + ("✅" if in_stock else "❌"), callback_data=f"adm_stock_{product_id}"),
        ]
        admin_row2 = [
            InlineKeyboardButton(text="❌ Удалить", callback_data=f"adm_del_{product_id}")
        ]
        buttons.append(admin_row1)
        buttons.append(admin_row2)
        
    # Go back button
    back_cb = "catalog" if not category else f"back_cat_{category}"
    if search_query:
        back_cb = "main_menu"
    buttons.append([InlineKeyboardButton(text="⬅️ Назад", callback_data=back_cb)])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_favorites_kb(
    product_id: int, 
    index: int = 0, 
    total: int = 1
) -> InlineKeyboardMarkup:
    buttons = []
    
    # Navigation row
    if total > 1:
        prev_idx = (index - 1) % total
        next_idx = (index + 1) % total
        buttons.append([
            InlineKeyboardButton(text="⬅️", callback_data=f"nav_fav_{prev_idx}"),
            InlineKeyboardButton(text=f"{index + 1}/{total}", callback_data="noop"),
            InlineKeyboardButton(text="➡️", callback_data=f"nav_fav_{next_idx}")
        ])
        
    buttons.append([
        InlineKeyboardButton(text="💔 Убрать", callback_data=f"fav_del_{product_id}_f"),
        InlineKeyboardButton(text="🛍️ Заказать", callback_data=f"order_{product_id}")
    ])
    buttons.append([InlineKeyboardButton(text="⬅️ Главное меню", callback_data="main_menu")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_order_confirm_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Подтвердить заказ", callback_data="order_confirm")],
        [InlineKeyboardButton(text="❌ Отменить", callback_data="order_cancel")]
    ])

def get_contacts_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📞 Связаться с менеджером", url=f"https://t.me/{settings.MANAGER_USERNAME}")],
        [InlineKeyboardButton(text="⬅️ Главное меню", callback_data="main_menu")]
    ])

def get_admin_panel_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="➕ Добавить товар", callback_data="adm_add_product"), InlineKeyboardButton(text="📢 Рассылка", callback_data="adm_broadcast")],
        [InlineKeyboardButton(text="📦 Все заказы", callback_data="adm_orders")],
        [InlineKeyboardButton(text="⬅️ Главное меню", callback_data="main_menu")]
    ])

def get_admin_orders_kb(
    order_id: int, 
    index: int = 0, 
    total: int = 1,
    status_filter: str = None
) -> InlineKeyboardMarkup:
    buttons = []
    
    # Navigation row
    prefix = f"ordersfilter_{status_filter}" if status_filter else "ordersall"
    if total > 1:
        prev_idx = (index - 1) % total
        next_idx = (index + 1) % total
        buttons.append([
            InlineKeyboardButton(text="⬅️", callback_data=f"nav_{prefix}_{prev_idx}"),
            InlineKeyboardButton(text=f"{index + 1}/{total}", callback_data="noop"),
            InlineKeyboardButton(text="➡️", callback_data=f"nav_{prefix}_{next_idx}")
        ])
        
    buttons.append([InlineKeyboardButton(text="🔄 Сменить статус", callback_data=f"adm_status_{order_id}")])
    buttons.append([InlineKeyboardButton(text="⬅️ Админ-панель", callback_data="admin_panel")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_status_selector_kb(order_id: int) -> InlineKeyboardMarkup:
    # Statuses
    buttons = [
        [
            InlineKeyboardButton(text="🆕 Новый", callback_data=f"status_NEW_{order_id}"),
            InlineKeyboardButton(text="✅ Подтвержден", callback_data=f"status_CONFIRMED_{order_id}")
        ],
        [
            InlineKeyboardButton(text="⚙️ В обработке", callback_data=f"status_PROCESSING_{order_id}"),
            InlineKeyboardButton(text="🚚 Доставляется", callback_data=f"status_SHIPPING_{order_id}")
        ],
        [
            InlineKeyboardButton(text="🏁 Завершен", callback_data=f"status_COMPLETED_{order_id}"),
            InlineKeyboardButton(text="❌ Отменен", callback_data=f"status_CANCELED_{order_id}")
        ],
        [InlineKeyboardButton(text="⬅️ Назад", callback_data="adm_orders")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_admin_categories_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="⌨️ Клавиатуры", callback_data="ac_keyboards"), InlineKeyboardButton(text="🖱️ Мышки", callback_data="ac_mice")],
        [InlineKeyboardButton(text="🎧 Наушники", callback_data="ac_headphones"), InlineKeyboardButton(text="🟪 Коврики", callback_data="ac_pads")],
        [InlineKeyboardButton(text="🔌 Другие", callback_data="ac_other")],
        [InlineKeyboardButton(text="❌ Отмена", callback_data="admin_panel")]
    ])

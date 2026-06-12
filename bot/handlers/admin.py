import asyncio
from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext

from config.config import settings
from database.repositories import ProductRepository, OrderRepository, UserRepository
from states.states import AddProductStates, EditProductPriceStates, BroadcastStates
from keyboards.inline import (
    get_admin_panel_kb,
    get_admin_categories_kb,
    get_admin_orders_kb,
    get_status_selector_kb,
    get_main_menu_kb
)
from services.notifications import notify_user_status_change

admin_router = Router()

# Helper admin check
def is_admin(user_id: int) -> bool:
    return user_id in settings.ADMIN_IDS


@admin_router.message(Command("stats"))
async def cmd_stats(message: Message):
    if not is_admin(message.from_user.id):
        return
        
    p_count = ProductRepository.count()
    o_count = OrderRepository.count()
    c_count = OrderRepository.count_clients()
    comp_count = OrderRepository.count("COMPLETED")
    canc_count = OrderRepository.count("CANCELED")
    new_count = OrderRepository.count("NEW")
    
    stats_text = (
        "<b>📊 Статистика магазина Keyllect:</b>\n\n"
        f"📦 Всего товаров: <b>{p_count}</b>\n"
        f"👤 Уникальных клиентов: <b>{c_count}</b>\n"
        f"🛒 Всего заказов: <b>{o_count}</b>\n"
        f"  └ 🆕 Новых: <b>{new_count}</b>\n"
        f"  └ 🏁 Завершенных: <b>{comp_count}</b>\n"
        f"  └ ❌ Отмененных: <b>{canc_count}</b>"
    )
    await message.answer(stats_text, parse_mode="HTML")


@admin_router.callback_query(F.data == "admin_panel")
async def cb_admin_panel(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        await callback.answer("У вас нет прав доступа к этой функции.", show_alert=True)
        return
        
    await callback.message.edit_text(
        "🛠️ <b>Панель администратора Keyllect:</b>\n\n"
        "Здесь вы можете управлять товарами и заказами магазина.",
        reply_markup=get_admin_panel_kb(),
        parse_mode="HTML"
    )


# --- VIEW ORDERS ---
async def show_order_at_index(bot: Bot, chat_id: int, message_id: int, orders: list, index: int):
    if not orders:
        await bot.send_message(chat_id, "Заказов пока нет.")
        return
        
    order = orders[index]
    
    # Status translations
    status_map = {
        'NEW': '🆕 Новый',
        'CONFIRMED': '✅ Подтвержден',
        'PROCESSING': '⚙️ В обработке',
        'SHIPPING': '🚚 Доставляется',
        'COMPLETED': '🏁 Завершен',
        'CANCELED': '❌ Отменен'
    }
    
    text = (
        f"📦 <b>Заказ #{order['id']}</b> ({index + 1} из {len(orders)})\n\n"
        f"👤 Клиент: <b>{order['full_name']}</b>\n"
        f"📞 Телефон: <b>{order['phone']}</b>\n"
        f"📍 Адрес: <b>{order['address']}</b>\n\n"
        f"🛍️ Товар: {order['product_name']}\n"
        f"💵 Стоимость: {order['product_price']:,} сум\n"
        f"📌 Статус: <b>{status_map.get(order['status'], order['status'])}</b>\n"
        f"📅 Дата: {order['created_at']}"
    )
    
    kb = get_admin_orders_kb(order['id'], index, len(orders))
    
    try:
        await bot.edit_message_text(
            chat_id=chat_id,
            message_id=message_id,
            text=text,
            reply_markup=kb,
            parse_mode="HTML"
        )
    except Exception:
        # Delete and send new
        try:
            await bot.delete_message(chat_id, message_id)
        except Exception:
            pass
        await bot.send_message(chat_id, text, reply_markup=kb, parse_mode="HTML")


@admin_router.callback_query(F.data == "adm_orders")
async def cb_adm_orders(callback: CallbackQuery, bot: Bot):
    if not is_admin(callback.from_user.id):
        return
        
    orders = OrderRepository.get_all()
    if not orders:
        await callback.answer("В магазине пока нет оформленных заказов.", show_alert=True)
        return
        
    await show_order_at_index(bot, callback.message.chat.id, callback.message.message_id, orders, 0)


@admin_router.callback_query(F.data.startswith("nav_ordersall_"))
async def cb_nav_orders(callback: CallbackQuery, bot: Bot):
    if not is_admin(callback.from_user.id):
        return
        
    index = int(callback.data.split("_")[2])
    orders = OrderRepository.get_all()
    await show_order_at_index(bot, callback.message.chat.id, callback.message.message_id, orders, index)


@admin_router.callback_query(F.data.startswith("adm_status_"))
async def cb_change_status_prompt(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
        
    order_id = int(callback.data.split("_")[2])
    await callback.message.edit_text(
        f"🔄 Выберите новый статус для заказа #{order_id}:",
        reply_markup=get_status_selector_kb(order_id)
    )


@admin_router.callback_query(F.data.startswith("status_"))
async def cb_set_status(callback: CallbackQuery, bot: Bot):
    if not is_admin(callback.from_user.id):
        return
        
    parts = callback.data.split("_")
    new_status = parts[1]
    order_id = int(parts[2])
    
    order = OrderRepository.get_by_id(order_id)
    if not order:
        await callback.answer("Заказ не найден.")
        return
        
    OrderRepository.update_status(order_id, new_status)
    await callback.answer(f"Статус заказа #{order_id} успешно обновлен!")
    
    # Notify user directly about status change
    await notify_user_status_change(
        bot=bot,
        user_id=order['user_id'],
        order_id=order_id,
        status=new_status,
        product_name=order['product_name']
    )
    
    # Return to order list
    orders = OrderRepository.get_all()
    # Find current index
    idx = next((i for i, o in enumerate(orders) if o['id'] == order_id), 0)
    await show_order_at_index(bot, callback.message.chat.id, callback.message.message_id, orders, idx)


# --- PRODUCT MANAGEMENT ---
@admin_router.callback_query(F.data == "adm_add_product")
async def cb_add_product(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
        
    await callback.message.edit_text(
        "➕ <b>Добавление нового товара</b>\n\nВыберите категорию товара:",
        reply_markup=get_admin_categories_kb(),
        parse_mode="HTML"
    )
    await state.set_state(AddProductStates.waiting_for_category)


@admin_router.callback_query(AddProductStates.waiting_for_category, F.data.startswith("ac_"))
async def cb_add_product_category(callback: CallbackQuery, state: FSMContext):
    category = callback.data.split("_")[1]
    await state.update_data(category=category)
    
    category_names = {
        'keyboards': 'Клавиатуры',
        'mice': 'Мышки',
        'headphones': 'Наушники',
        'pads': 'Коврики',
        'other': 'Другие аксессуары'
    }
    
    await callback.message.edit_text(
        f"Категория: <b>{category_names.get(category)}</b>\n\n"
        f"📝 Введите название товара:",
        parse_mode="HTML"
    )
    await state.set_state(AddProductStates.waiting_for_name)


@admin_router.message(AddProductStates.waiting_for_name)
async def process_add_name(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    await state.update_data(name=message.text.strip())
    await message.answer("📝 Введите описание товара:")
    await state.set_state(AddProductStates.waiting_for_description)


@admin_router.message(AddProductStates.waiting_for_description)
async def process_add_description(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    await state.update_data(description=message.text.strip())
    await message.answer("💵 Введите цену товара (только цифры):")
    await state.set_state(AddProductStates.waiting_for_price)


@admin_router.message(AddProductStates.waiting_for_price)
async def process_add_price(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    price_text = message.text.strip()
    if not price_text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число:")
        return
        
    await state.update_data(price=float(price_text))
    await message.answer(
        "🔥 Введите старую цену товара (если есть скидка) или введите 'нет' для обычной цены:"
    )
    await state.set_state(AddProductStates.waiting_for_old_price)


@admin_router.message(AddProductStates.waiting_for_old_price)
async def process_add_old_price(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    text = message.text.strip().lower()
    
    if text == "нет":
        await state.update_data(is_sale=0, old_price=None)
    elif text.isdigit():
        await state.update_data(is_sale=1, old_price=float(text))
    else:
        await message.answer("❌ Пожалуйста, введите цену цифрами или напишите 'нет':")
        return
        
    await message.answer(
        "📸 Отправьте фото товара (или отправьте ссылку на картинку, или напишите 'нет' для работы без фото):"
    )
    await state.set_state(AddProductStates.waiting_for_photo)


@admin_router.message(AddProductStates.waiting_for_photo)
async def process_add_photo(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    photo_value = None
    if message.photo:
        # Save Telegram File ID
        photo_value = message.photo[-1].file_id
    else:
        text = message.text.strip()
        if text.lower() != "нет":
            photo_value = text

    data = await state.get_data()
    await state.clear()
    
    ProductRepository.create(
        category=data['category'],
        name=data['name'],
        description=data['description'],
        price=data['price'],
        photo=photo_value,
        is_sale=data['is_sale'],
        old_price=data.get('old_price')
    )
    
    await message.answer(
        f"✅ Товар <b>{data['name']}</b> успешно добавлен!",
        reply_markup=get_admin_panel_kb(),
        parse_mode="HTML"
    )


# --- EDIT PRICE ---
@admin_router.callback_query(F.data.startswith("adm_price_"))
async def cb_edit_price_prompt(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
        
    product_id = int(callback.data.split("_")[2])
    await state.update_data(product_id=product_id)
    
    await callback.message.answer(
        "✏️ Введите новую цену товара:"
    )
    await state.set_state(EditProductPriceStates.waiting_for_price)
    try:
        await callback.message.delete()
    except Exception:
        pass


@admin_router.message(EditProductPriceStates.waiting_for_price)
async def process_edit_price(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    price_text = message.text.strip()
    if not price_text.isdigit():
        await message.answer("❌ Пожалуйста, введите корректное число:")
        return
        
    await state.update_data(price=float(price_text))
    await message.answer("🔥 Введите старую цену товара для скидки (или напишите 'нет'):")
    await state.set_state(EditProductPriceStates.waiting_for_old_price)


@admin_router.message(EditProductPriceStates.waiting_for_old_price)
async def process_edit_old_price(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    text = message.text.strip().lower()
    data = await state.get_data()
    await state.clear()
    
    is_sale = 0
    old_price = None
    if text != "нет" and text.isdigit():
        is_sale = 1
        old_price = float(text)
        
    ProductRepository.update_price(
        product_id=data['product_id'],
        price=data['price'],
        is_sale=is_sale,
        old_price=old_price
    )
    
    await message.answer(
        "✅ Цена товара успешно обновлена!",
        reply_markup=get_main_menu_kb(True)
    )


# --- TOGGLE STOCK ---
@admin_router.callback_query(F.data.startswith("adm_stock_"))
async def cb_toggle_stock(callback: CallbackQuery, bot: Bot):
    if not is_admin(callback.from_user.id):
        return
        
    product_id = int(callback.data.split("_")[2])
    product = ProductRepository.get_by_id(product_id)
    if not product:
        return
        
    new_stock = 0 if product['in_stock'] else 1
    ProductRepository.update_stock(product_id, new_stock)
    
    # Refresh detail page
    from handlers.client import show_product_at_index
    products = ProductRepository.get_all(product['category'])
    idx = next((i for i, p in enumerate(products) if p['id'] == product_id), 0)
    
    await show_product_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        products=products,
        index=idx,
        category=product['category'],
        user_id=callback.from_user.id
    )


# --- DELETE PRODUCT ---
@admin_router.callback_query(F.data.startswith("adm_del_"))
async def cb_delete_product(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
        
    product_id = int(callback.data.split("_")[2])
    ProductRepository.delete(product_id)
    await callback.answer("Товар успешно удален из базы данных! ❌")
    
    # Return to categories
    await callback.message.edit_text(
        "📂 Выберите категорию товаров:",
        reply_markup=get_admin_categories_kb()
    )


# --- BROADCAST (PUSH) ---
@admin_router.callback_query(F.data == "adm_broadcast")
async def cb_broadcast_prompt(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        return
        
    await callback.message.edit_text(
        "📢 <b>Рассылка сообщений (PUSH)</b>\n\n"
        "Отправьте сообщение (текст, фото или фото с подписью), которое увидят все пользователи бота.",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="❌ Отмена", callback_data="admin_panel")]]),
        parse_mode="HTML"
    )
    await state.set_state(BroadcastStates.waiting_for_message)


@admin_router.message(BroadcastStates.waiting_for_message)
async def process_broadcast_message(message: Message, state: FSMContext, bot: Bot):
    if not is_admin(message.from_user.id):
        return
        
    user_ids = UserRepository.get_all_ids()
    await state.clear()
    
    if not user_ids:
        await message.answer("❌ В базе данных нет зарегистрированных пользователей.")
        return
        
    status_msg = await message.answer(f"⏳ Начинаю рассылку для {len(user_ids)} пользователей...")
    
    success = 0
    failed = 0
    
    for uid in user_ids:
        try:
            if message.photo:
                # Send photo with caption
                await bot.send_photo(
                    chat_id=uid,
                    photo=message.photo[-1].file_id,
                    caption=message.caption or "",
                    parse_mode="HTML"
                )
            else:
                # Send text only
                await bot.send_message(
                    chat_id=uid,
                    text=message.text,
                    parse_mode="HTML"
                )
            success += 1
        except Exception:
            failed += 1
        # Prevent Telegram rate limit
        await asyncio.sleep(0.05)
        
    await status_msg.edit_text(
        f"📢 <b>Рассылка завершена!</b>\n\n"
        f"✅ Успешно отправлено: <b>{success}</b>\n"
        f"❌ Ошибок (заблокировали бота/удалены): <b>{failed}</b>",
        reply_markup=get_admin_panel_kb(),
        parse_mode="HTML"
    )

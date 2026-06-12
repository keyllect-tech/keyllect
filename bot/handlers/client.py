import os
from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, InputMediaPhoto, FSInputFile
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext

from config.config import settings
from database.repositories import ProductRepository, OrderRepository, FavoriteRepository, UserRepository
from states.states import OrderStates, SearchStates
from keyboards.inline import (
    get_main_menu_kb,
    get_categories_kb,
    get_product_detail_kb,
    get_favorites_kb,
    get_order_confirm_kb,
    get_contacts_kb
)

client_router = Router()

def get_product_text(product: dict) -> str:
    status = "✅ В наличии" if product['in_stock'] else "❌ Нет в наличии"
    
    price_section = ""
    if product['is_sale']:
        price_section = (
            f"🔥 <b>Скидка!</b>\n"
            f"<s>Старая цена: {product['old_price']:,} сум</s>\n"
            f"<b>Новая цена: {product['price']:,} сум</b>"
        )
    else:
        price_section = f"<b>Цена: {product['price']:,} сум</b>"

    return (
        f"🛍️ <b>{product['name']}</b>\n\n"
        f"📝 <i>{product['description']}</i>\n\n"
        f"📦 {status}\n"
        f"💵 {price_section}"
    )

async def show_product_at_index(
    bot: Bot, 
    chat_id: int, 
    message_id: int, 
    products: list, 
    index: int, 
    category: str, 
    user_id: int,
    search_query: str = None
):
    if not products:
        await bot.send_message(chat_id, "Товары не найдены.")
        return
        
    product = products[index]
    text = get_product_text(product)
    is_fav = FavoriteRepository.is_favorite(user_id, product['id'])
    is_admin = user_id in settings.ADMIN_IDS
    
    kb = get_product_detail_kb(
        product_id=product['id'],
        category=category,
        is_fav=is_fav,
        in_stock=bool(product['in_stock']),
        is_admin=is_admin,
        index=index,
        total=len(products),
        search_query=search_query
    )
    
    # Try to edit media message
    photo_path = product['photo']
    
    # Check if photo path is a local file or string
    media = None
    if photo_path:
        if os.path.exists(photo_path):
            media = InputMediaPhoto(media=FSInputFile(photo_path), caption=text, parse_mode="HTML")
        else:
            media = InputMediaPhoto(media=photo_path, caption=text, parse_mode="HTML")
            
    try:
        if media:
            await bot.edit_message_media(
                chat_id=chat_id,
                message_id=message_id,
                media=media,
                reply_markup=kb
            )
        else:
            await bot.edit_message_text(
                chat_id=chat_id,
                message_id=message_id,
                text=text,
                reply_markup=kb,
                parse_mode="HTML"
            )
    except Exception:
        # If edit fails, delete old and send new
        try:
            await bot.delete_message(chat_id, message_id)
        except Exception:
            pass
            
        if photo_path:
            if os.path.exists(photo_path):
                await bot.send_photo(chat_id, photo=FSInputFile(photo_path), caption=text, reply_markup=kb, parse_mode="HTML")
            else:
                await bot.send_photo(chat_id, photo=photo_path, caption=text, reply_markup=kb, parse_mode="HTML")
        else:
            await bot.send_message(chat_id, text, reply_markup=kb, parse_mode="HTML")


@client_router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    UserRepository.save(
        user_id=message.from_user.id,
        username=message.from_user.username,
        first_name=message.from_user.first_name
    )
    is_admin = message.from_user.id in settings.ADMIN_IDS
    welcome_text = (
        f"👋 Приветствуем в магазине игровых аксессуаров <b>Keyllect</b>, {message.from_user.first_name}!\n\n"
        f"Здесь вы найдете лучшие клавиатуры, мышки, наушники и коврики по отличным ценам. "
        f"Используйте меню ниже для навигации."
    )
    await message.answer(welcome_text, reply_markup=get_main_menu_kb(is_admin), parse_mode="HTML")


@client_router.callback_query(F.data == "main_menu")
async def cb_main_menu(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    UserRepository.save(
        user_id=callback.from_user.id,
        username=callback.from_user.username,
        first_name=callback.from_user.first_name
    )
    is_admin = callback.from_user.id in settings.ADMIN_IDS
    welcome_text = (
        f"💻 Главное меню магазина <b>Keyllect</b>.\n"
        f"Выберите интересующий вас раздел:"
    )
    try:
        await callback.message.edit_text(welcome_text, reply_markup=get_main_menu_kb(is_admin), parse_mode="HTML")
    except Exception:
        await callback.message.answer(welcome_text, reply_markup=get_main_menu_kb(is_admin), parse_mode="HTML")
        try:
            await callback.message.delete()
        except Exception:
            pass


@client_router.callback_query(F.data == "catalog")
async def cb_catalog(callback: CallbackQuery):
    text = "📂 Выберите категорию товаров:"
    await callback.message.edit_text(text, reply_markup=get_categories_kb())


@client_router.callback_query(F.data.startswith("cat_"))
async def cb_category_products(callback: CallbackQuery, bot: Bot):
    category = callback.data.split("_")[1]
    products = ProductRepository.get_all(category)
    
    if not products:
        await callback.answer("В этой категории пока нет товаров.", show_alert=True)
        return
        
    await show_product_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        products=products,
        index=0,
        category=category,
        user_id=callback.from_user.id
    )


@client_router.callback_query(F.data.startswith("nav_cat_"))
async def cb_nav_category(callback: CallbackQuery, bot: Bot):
    parts = callback.data.split("_")
    category = parts[2]
    index = int(parts[3])
    products = ProductRepository.get_all(category)
    
    await show_product_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        products=products,
        index=index,
        category=category,
        user_id=callback.from_user.id
    )


@client_router.callback_query(F.data.startswith("back_cat_"))
async def cb_back_to_category(callback: CallbackQuery):
    # Just redirect back to the catalog categories list
    await cb_catalog(callback)


@client_router.callback_query(F.data.startswith("fav_add_"))
async def cb_add_favorite(callback: CallbackQuery, bot: Bot):
    parts = callback.data.split("_")
    product_id = int(parts[2])
    
    # Check if there is search parameter
    is_search = "s" in parts
    search_query = parts[-1] if is_search else None
    
    FavoriteRepository.add(callback.from_user.id, product_id)
    await callback.answer("Добавлено в избранное ❤️")
    
    # Re-render
    product = ProductRepository.get_by_id(product_id)
    if is_search and search_query:
        products = ProductRepository.search_by_name(search_query)
        idx = next((i for i, p in enumerate(products) if p['id'] == product_id), 0)
        await show_product_at_index(
            bot=bot,
            chat_id=callback.message.chat.id,
            message_id=callback.message.message_id,
            products=products,
            index=idx,
            category=product['category'],
            user_id=callback.from_user.id,
            search_query=search_query
        )
    else:
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


@client_router.callback_query(F.data.startswith("fav_del_"))
async def cb_del_favorite(callback: CallbackQuery, bot: Bot):
    parts = callback.data.split("_")
    product_id = int(parts[2])
    
    # Check if we are inside favorites screen ("f") or search ("s")
    is_favorites_view = "f" in parts
    is_search = "s" in parts
    search_query = parts[-1] if is_search else None

    FavoriteRepository.remove(callback.from_user.id, product_id)
    await callback.answer("Удалено из избранного 💔")
    
    if is_favorites_view:
        # Re-render favorites list
        favs = FavoriteRepository.get_favorites(callback.from_user.id)
        if not favs:
            await callback.message.edit_text("У вас нет избранных товаров.", reply_markup=get_main_menu_kb(callback.from_user.id in settings.ADMIN_IDS))
        else:
            await show_favorite_at_index(
                bot=bot,
                chat_id=callback.message.chat.id,
                message_id=callback.message.message_id,
                favs=favs,
                index=0
            )
    else:
        # Re-render details view
        product = ProductRepository.get_by_id(product_id)
        if is_search and search_query:
            products = ProductRepository.search_by_name(search_query)
            idx = next((i for i, p in enumerate(products) if p['id'] == product_id), 0)
            await show_product_at_index(
                bot=bot,
                chat_id=callback.message.chat.id,
                message_id=callback.message.message_id,
                products=products,
                index=idx,
                category=product['category'],
                user_id=callback.from_user.id,
                search_query=search_query
            )
        else:
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


@client_router.callback_query(F.data == "favorites")
async def cb_view_favorites(callback: CallbackQuery, bot: Bot):
    favs = FavoriteRepository.get_favorites(callback.from_user.id)
    if not favs:
        await callback.answer("Список избранного пуст ⭐", show_alert=True)
        return
        
    await show_favorite_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        favs=favs,
        index=0
    )


async def show_favorite_at_index(bot: Bot, chat_id: int, message_id: int, favs: list, index: int):
    product = favs[index]
    text = get_product_text(product)
    kb = get_favorites_kb(product['id'], index, len(favs))
    
    photo_path = product['photo']
    media = None
    if photo_path:
        if os.path.exists(photo_path):
            media = InputMediaPhoto(media=FSInputFile(photo_path), caption=text, parse_mode="HTML")
        else:
            media = InputMediaPhoto(media=photo_path, caption=text, parse_mode="HTML")
            
    try:
        if media:
            await bot.edit_message_media(chat_id=chat_id, message_id=message_id, media=media, reply_markup=kb)
        else:
            await bot.edit_message_text(chat_id=chat_id, message_id=message_id, text=text, reply_markup=kb, parse_mode="HTML")
    except Exception:
        try:
            await bot.delete_message(chat_id, message_id)
        except Exception:
            pass
            
        if photo_path:
            if os.path.exists(photo_path):
                await bot.send_photo(chat_id, photo=FSInputFile(photo_path), caption=text, reply_markup=kb, parse_mode="HTML")
            else:
                await bot.send_photo(chat_id, photo=photo_path, caption=text, reply_markup=kb, parse_mode="HTML")
        else:
            await bot.send_message(chat_id, text, reply_markup=kb, parse_mode="HTML")


@client_router.callback_query(F.data.startswith("nav_fav_"))
async def cb_nav_favorites(callback: CallbackQuery, bot: Bot):
    index = int(callback.data.split("_")[2])
    favs = FavoriteRepository.get_favorites(callback.from_user.id)
    await show_favorite_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        favs=favs,
        index=index
    )


@client_router.callback_query(F.data == "search_products")
async def cb_search_prompt(callback: CallbackQuery, state: FSMContext):
    await callback.message.edit_text(
        "🔍 Введите название товара (или его часть) для поиска:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="❌ Отмена", callback_data="main_menu")]])
    )
    await state.set_state(SearchStates.waiting_for_query)


@client_router.message(SearchStates.waiting_for_query)
async def process_search_query(message: Message, state: FSMContext, bot: Bot):
    query = message.text.strip()
    products = ProductRepository.search_by_name(query)
    await state.clear()
    
    if not products:
        await message.answer(
            f"❌ Товары по запросу «{query}» не найдены.",
            reply_markup=get_main_menu_kb(message.from_user.id in settings.ADMIN_IDS)
        )
        return
        
    # Send first search result
    product = products[0]
    text = get_product_text(product)
    is_fav = FavoriteRepository.is_favorite(message.from_user.id, product['id'])
    is_admin = message.from_user.id in settings.ADMIN_IDS
    
    kb = get_product_detail_kb(
        product_id=product['id'],
        category=product['category'],
        is_fav=is_fav,
        in_stock=bool(product['in_stock']),
        is_admin=is_admin,
        index=0,
        total=len(products),
        search_query=query
    )
    
    photo_path = product['photo']
    if photo_path:
        if os.path.exists(photo_path):
            await message.answer_photo(photo=FSInputFile(photo_path), caption=text, reply_markup=kb, parse_mode="HTML")
        else:
            await message.answer_photo(photo=photo_path, caption=text, reply_markup=kb, parse_mode="HTML")
    else:
        await message.answer(text, reply_markup=kb, parse_mode="HTML")


@client_router.callback_query(F.data.startswith("nav_search_"))
async def cb_nav_search(callback: CallbackQuery, bot: Bot):
    parts = callback.data.split("_")
    query = parts[2]
    index = int(parts[3])
    products = ProductRepository.search_by_name(query)
    
    await show_product_at_index(
        bot=bot,
        chat_id=callback.message.chat.id,
        message_id=callback.message.message_id,
        products=products,
        index=index,
        category=None,
        user_id=callback.from_user.id,
        search_query=query
    )


@client_router.callback_query(F.data == "about")
async def cb_about(callback: CallbackQuery):
    about_text = (
        "<b>ℹ️ О магазине Keyllect</b>\n\n"
        "Keyllect — это премиальный магазин аксессуаров для геймеров, киберспортсменов и любителей качественной периферии.\n\n"
        "Мы предлагаем:\n"
        "• Механические клавиатуры лучших брендов\n"
        "• Легкие эргономичные игровые мыши\n"
        "• Наушники с объёмным звуком\n"
        "• Износостойкие коврики\n\n"
        "🚚 Быстрая доставка по всей стране. Гарантия качества на всю продукцию!"
    )
    await callback.message.edit_text(about_text, reply_markup=get_main_menu_kb(callback.from_user.id in settings.ADMIN_IDS), parse_mode="HTML")


@client_router.callback_query(F.data == "contacts")
async def cb_contacts(callback: CallbackQuery):
    contacts_text = (
        "<b>📞 Контакты Keyllect</b>\n\n"
        "📍 Наш адрес: г. Ташкент, ул. Шота Руставели, 12\n"
        "📞 Телефон поддержки: +998 (90) 123-45-67\n"
        "📨 Email: support@keyllect.uz\n\n"
        "Нажмите кнопку ниже, чтобы начать чат с менеджером:"
    )
    await callback.message.edit_text(contacts_text, reply_markup=get_contacts_kb(), parse_mode="HTML")


@client_router.callback_query(F.data == "my_orders")
async def cb_my_orders(callback: CallbackQuery):
    orders = OrderRepository.get_by_user(callback.from_user.id)
    if not orders:
        await callback.answer("У вас пока нет оформленных заказов.", show_alert=True)
        return
        
    text = "<b>📦 Ваши заказы:</b>\n\n"
    # Status translations
    status_map = {
        'NEW': '🆕 Новый',
        'CONFIRMED': '✅ Подтвержден',
        'PROCESSING': '⚙️ В обработке',
        'SHIPPING': '🚚 Доставляется',
        'COMPLETED': '🏁 Завершен',
        'CANCELED': '❌ Отменен'
    }
    
    for o in orders:
        text += (
            f"🏷️ <b>Заказ #{o['id']}</b>\n"
            f"🛒 Товар: {o['product_name']}\n"
            f"💵 Стоимость: {o['product_price']:,} сум\n"
            f"📌 Статус: <b>{status_map.get(o['status'], o['status'])}</b>\n"
            f"📅 Дата: {o['created_at']}\n"
            f"───────────────────\n\n"
        )
        
    await callback.message.edit_text(text, reply_markup=get_main_menu_kb(callback.from_user.id in settings.ADMIN_IDS), parse_mode="HTML")


# --- ORDER FSM HANDLERS ---
@client_router.callback_query(F.data.startswith("order_"))
async def cb_start_order(callback: CallbackQuery, state: FSMContext):
    product_id = int(callback.data.split("_")[1])
    product = ProductRepository.get_by_id(product_id)
    
    if not product['in_stock']:
        await callback.answer("Извините, этого товара нет в наличии.", show_alert=True)
        return
        
    await state.update_data(product_id=product_id)
    
    # Prompt name
    await callback.message.answer(
        "📝 Шаг 1/3: Введите ваше Имя и Фамилию:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="❌ Отмена", callback_data="main_menu")]])
    )
    await state.set_state(OrderStates.waiting_for_name)
    try:
        await callback.message.delete()
    except Exception:
        pass


@client_router.message(OrderStates.waiting_for_name)
async def process_order_name(message: Message, state: FSMContext):
    name = message.text.strip()
    await state.update_data(full_name=name)
    
    # Prompt phone
    await message.answer(
        "📞 Шаг 2/3: Введите ваш номер телефона (например, +998901234567):",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="❌ Отмена", callback_data="main_menu")]])
    )
    await state.set_state(OrderStates.waiting_for_phone)


@client_router.message(OrderStates.waiting_for_phone)
async def process_order_phone(message: Message, state: FSMContext):
    phone = message.text.strip()
    await state.update_data(phone=phone)
    
    # Prompt address
    await message.answer(
        "📍 Шаг 3/3: Введите адрес доставки:",
        reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="❌ Отмена", callback_data="main_menu")]])
    )
    await state.set_state(OrderStates.waiting_for_address)


@client_router.message(OrderStates.waiting_for_address)
async def process_order_address(message: Message, state: FSMContext):
    address = message.text.strip()
    await state.update_data(address=address)
    
    data = await state.get_data()
    product = ProductRepository.get_by_id(data['product_id'])
    
    summary_text = (
        f"<b>📋 Подтверждение заказа:</b>\n\n"
        f"👤 Получатель: <b>{data['full_name']}</b>\n"
        f"📞 Телефон: <b>{data['phone']}</b>\n"
        f"📍 Адрес доставки: <b>{data['address']}</b>\n\n"
        f"🛍️ Товар: <b>{product['name']}</b>\n"
        f"💵 Итого к оплате: <b>{product['price']:,} сум</b>"
    )
    
    await message.answer(summary_text, reply_markup=get_order_confirm_kb(), parse_mode="HTML")
    await state.set_state(OrderStates.confirm_order)


@client_router.callback_query(OrderStates.confirm_order, F.data == "order_confirm")
async def cb_confirm_order(callback: CallbackQuery, state: FSMContext, bot: Bot):
    data = await state.get_data()
    await state.clear()
    
    # Create order
    order_id = OrderRepository.create(
        user_id=callback.from_user.id,
        full_name=data['full_name'],
        phone=data['phone'],
        address=data['address'],
        product_id=data['product_id']
    )
    
    order = OrderRepository.get_by_id(order_id)
    
    # Notify User
    await callback.message.edit_text(
        f"🎉 <b>Ваш заказ #{order_id} успешно оформлен!</b>\n\n"
        f"Наш менеджер свяжется с вами в ближайшее время для подтверждения доставки. "
        f"Вы можете отслеживать статус в разделе «Мои заказы».",
        reply_markup=get_main_menu_kb(callback.from_user.id in settings.ADMIN_IDS),
        parse_mode="HTML"
    )
    
    # Notify Admin
    from services.notifications import notify_admins_new_order
    await notify_admins_new_order(bot, order)


@client_router.callback_query(OrderStates.confirm_order, F.data == "order_cancel")
async def cb_cancel_order(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    is_admin = callback.from_user.id in settings.ADMIN_IDS
    await callback.message.edit_text(
        "❌ Оформление заказа отменено.",
        reply_markup=get_main_menu_kb(is_admin)
    )

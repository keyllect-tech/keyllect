from aiogram.fsm.state import State, StatesGroup

class OrderStates(StatesGroup):
    waiting_for_name = State()
    waiting_for_phone = State()
    waiting_for_address = State()
    confirm_order = State()

class SearchStates(StatesGroup):
    waiting_for_query = State()

class AddProductStates(StatesGroup):
    waiting_for_category = State()
    waiting_for_name = State()
    waiting_for_description = State()
    waiting_for_price = State()
    waiting_for_old_price = State() # if sale
    waiting_for_photo = State()

class EditProductPriceStates(StatesGroup):
    waiting_for_price = State()
    waiting_for_old_price = State()

class BroadcastStates(StatesGroup):
    waiting_for_message = State()

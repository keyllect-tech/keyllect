export type Locale = 'ru' | 'uz'

export const locales: Locale[] = ['ru', 'uz']

export const defaultLocale: Locale = 'ru'

export const translations = {
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      about: 'О нас',
      contacts: 'Контакты',
      cart: 'Корзина',
      favorites: 'Избранное',
      account: 'Личный кабинет',
      search: 'Поиск товаров...',
    },
    // Hero
    hero: {
      title: 'Collect The Best Gear',
      subtitle: 'Премиальная периферия для работы, игр и творчества.',
      catalogBtn: 'Каталог',
      popularBtn: 'Популярные товары',
    },
    // Categories
    categories: {
      title: 'Категории',
      keyboards: 'Клавиатуры',
      mice: 'Мыши',
      mousepads: 'Коврики',
      headsets: 'Наушники',
      accessories: 'Аксессуары',
    },
    // Products
    products: {
      title: 'Популярные товары',
      addToCart: 'В корзину',
      buyNow: 'Купить сейчас',
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
      reviews: 'отзывов',
      characteristics: 'Характеристики',
      description: 'Описание',
      recommended: 'Рекомендуемые товары',
      viewAll: 'Смотреть все',
      price: 'Цена',
      brand: 'Бренд',
      sort: 'Сортировка',
      filter: 'Фильтры',
      resetFilters: 'Сбросить фильтры',
      sortOptions: {
        popular: 'По популярности',
        priceAsc: 'Сначала дешевле',
        priceDesc: 'Сначала дороже',
        newest: 'Новинки',
        rating: 'По рейтингу',
      },
    },
    // Why Keyllect
    whyUs: {
      title: 'Почему выбирают Keyllect',
      warranty: {
        title: 'Официальная гарантия',
        desc: 'Гарантия от производителя на всю продукцию',
      },
      delivery: {
        title: 'Быстрая доставка',
        desc: 'Доставка по всему Узбекистану за 1-3 дня',
      },
      original: {
        title: 'Оригинальная продукция',
        desc: 'Только сертифицированные товары',
      },
      support: {
        title: 'Поддержка клиентов',
        desc: 'Консультация и помощь 24/7',
      },
    },
    // Brands
    brands: {
      title: 'Наши бренды',
    },
    // Reviews
    reviews: {
      title: 'Отзывы клиентов',
      writeReview: 'Написать отзыв',
    },
    // Newsletter
    newsletter: {
      title: 'Подпишитесь на новости',
      subtitle: 'Получайте информацию о новинках и акциях первыми',
      placeholder: 'Ваш email',
      button: 'Подписаться',
      success: 'Вы успешно подписались!',
    },
    // Footer
    footer: {
      description: 'Премиальный магазин компьютерной периферии',
      catalog: 'Каталог',
      company: 'Компания',
      help: 'Помощь',
      contacts: 'Контакты',
      privacy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      delivery: 'Доставка и оплата',
      returns: 'Возврат и обмен',
      faq: 'FAQ',
      rights: 'Все права защищены',
    },
    // Cart
    cart: {
      title: 'Корзина',
      empty: 'Ваша корзина пуста',
      continueShopping: 'Продолжить покупки',
      total: 'Итого',
      subtotal: 'Подытог',
      shipping: 'Доставка',
      checkout: 'Оформить заказ',
      remove: 'Удалить',
      quantity: 'Количество',
      free: 'Бесплатно',
    },
    // Checkout
    checkout: {
      title: 'Оформление заказа',
      personalInfo: 'Личные данные',
      deliveryInfo: 'Доставка',
      paymentInfo: 'Оплата',
      firstName: 'Имя',
      lastName: 'Фамилия',
      phone: 'Телефон',
      email: 'Email',
      address: 'Адрес',
      city: 'Город',
      comment: 'Комментарий к заказу',
      paymentMethod: 'Способ оплаты',
      cash: 'Наличными при получении',
      card: 'Картой онлайн',
      placeOrder: 'Подтвердить заказ',
      orderSuccess: 'Заказ успешно оформлен!',
      orderNumber: 'Номер заказа',
    },
    // Account
    account: {
      title: 'Личный кабинет',
      orders: 'Мои заказы',
      profile: 'Профиль',
      settings: 'Настройки',
      logout: 'Выйти',
      login: 'Войти',
      register: 'Регистрация',
      noOrders: 'У вас пока нет заказов',
    },
    // About
    about: {
      title: 'О нас',
      subtitle: 'Keyllect — ваш надёжный партнёр в мире игровой периферии',
      mission: 'Наша миссия',
      missionText: 'Мы стремимся предоставить геймерам и профессионалам лучшее оборудование по доступным ценам.',
      values: 'Наши ценности',
      quality: 'Качество',
      qualityText: 'Только оригинальная продукция от проверенных брендов',
      service: 'Сервис',
      serviceText: 'Профессиональная консультация и поддержка',
      trust: 'Доверие',
      trustText: 'Тысячи довольных клиентов по всему Узбекистану',
    },
    // Contacts
    contacts: {
      title: 'Контакты',
      subtitle: 'Свяжитесь с нами',
      address: 'Адрес',
      addressValue: 'г. Ташкент, ул. Амира Темура, 1',
      phone: 'Телефон',
      email: 'Email',
      workHours: 'Часы работы',
      workHoursValue: 'Пн-Вс: 09:00 - 21:00',
      sendMessage: 'Отправить сообщение',
      name: 'Ваше имя',
      message: 'Сообщение',
      send: 'Отправить',
    },
    // Common
    common: {
      currency: 'сум',
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      notFound: 'Страница не найдена',
      back: 'Назад',
      next: 'Далее',
      prev: 'Назад',
      close: 'Закрыть',
      save: 'Сохранить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      search: 'Поиск',
      noResults: 'Ничего не найдено',
    },
  },
  uz: {
    // Navigation
    nav: {
      home: 'Bosh sahifa',
      catalog: 'Katalog',
      about: 'Biz haqimizda',
      contacts: 'Kontaktlar',
      cart: 'Savat',
      favorites: 'Sevimlilar',
      account: 'Shaxsiy kabinet',
      search: 'Mahsulot qidirish...',
    },
    // Hero
    hero: {
      title: 'Collect The Best Gear',
      subtitle: 'Ish, o\'yin va ijod uchun premium periferiya.',
      catalogBtn: 'Katalog',
      popularBtn: 'Mashhur mahsulotlar',
    },
    // Categories
    categories: {
      title: 'Kategoriyalar',
      keyboards: 'Klaviaturalar',
      mice: 'Sichqonchalar',
      mousepads: 'Gilamchalar',
      headsets: 'Quloqliklar',
      accessories: 'Aksessuarlar',
    },
    // Products
    products: {
      title: 'Mashhur mahsulotlar',
      addToCart: 'Savatga',
      buyNow: 'Hozir sotib olish',
      inStock: 'Mavjud',
      outOfStock: 'Mavjud emas',
      reviews: 'sharhlar',
      characteristics: 'Xususiyatlar',
      description: 'Tavsif',
      recommended: 'Tavsiya etilgan mahsulotlar',
      viewAll: 'Hammasini ko\'rish',
      price: 'Narx',
      brand: 'Brend',
      sort: 'Saralash',
      filter: 'Filtrlar',
      resetFilters: 'Filtrlarni tiklash',
      sortOptions: {
        popular: 'Mashhurlik bo\'yicha',
        priceAsc: 'Arzonroq',
        priceDesc: 'Qimmatroq',
        newest: 'Yangi',
        rating: 'Reyting bo\'yicha',
      },
    },
    // Why Keyllect
    whyUs: {
      title: 'Nega Keyllect tanlanadi',
      warranty: {
        title: 'Rasmiy kafolat',
        desc: 'Barcha mahsulotlarga ishlab chiqaruvchi kafolati',
      },
      delivery: {
        title: 'Tez yetkazib berish',
        desc: 'O\'zbekiston bo\'ylab 1-3 kun ichida yetkazib berish',
      },
      original: {
        title: 'Original mahsulotlar',
        desc: 'Faqat sertifikatlangan tovarlar',
      },
      support: {
        title: 'Mijozlarni qo\'llab-quvvatlash',
        desc: 'Maslahat va yordam 24/7',
      },
    },
    // Brands
    brands: {
      title: 'Bizning brendlar',
    },
    // Reviews
    reviews: {
      title: 'Mijozlar sharhlari',
      writeReview: 'Sharh yozish',
    },
    // Newsletter
    newsletter: {
      title: 'Yangiliklardan xabardor bo\'ling',
      subtitle: 'Yangi mahsulotlar va aksiyalar haqida birinchi bo\'lib biling',
      placeholder: 'Sizning email',
      button: 'Obuna bo\'lish',
      success: 'Muvaffaqiyatli obuna bo\'ldingiz!',
    },
    // Footer
    footer: {
      description: 'Premium kompyuter periferiyasi do\'koni',
      catalog: 'Katalog',
      company: 'Kompaniya',
      help: 'Yordam',
      contacts: 'Kontaktlar',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      delivery: 'Yetkazib berish va to\'lov',
      returns: 'Qaytarish va almashtirish',
      faq: 'TSS',
      rights: 'Barcha huquqlar himoyalangan',
    },
    // Cart
    cart: {
      title: 'Savat',
      empty: 'Savatingiz bo\'sh',
      continueShopping: 'Xarid qilishni davom ettirish',
      total: 'Jami',
      subtotal: 'Oraliq summa',
      shipping: 'Yetkazib berish',
      checkout: 'Buyurtmani rasmiylashtirish',
      remove: 'O\'chirish',
      quantity: 'Miqdor',
      free: 'Bepul',
    },
    // Checkout
    checkout: {
      title: 'Buyurtmani rasmiylashtirish',
      personalInfo: 'Shaxsiy ma\'lumotlar',
      deliveryInfo: 'Yetkazib berish',
      paymentInfo: 'To\'lov',
      firstName: 'Ism',
      lastName: 'Familiya',
      phone: 'Telefon',
      email: 'Email',
      address: 'Manzil',
      city: 'Shahar',
      comment: 'Buyurtmaga izoh',
      paymentMethod: 'To\'lov usuli',
      cash: 'Naqd pul bilan',
      card: 'Karta orqali onlayn',
      placeOrder: 'Buyurtmani tasdiqlash',
      orderSuccess: 'Buyurtma muvaffaqiyatli rasmiylashtirildi!',
      orderNumber: 'Buyurtma raqami',
    },
    // Account
    account: {
      title: 'Shaxsiy kabinet',
      orders: 'Mening buyurtmalarim',
      profile: 'Profil',
      settings: 'Sozlamalar',
      logout: 'Chiqish',
      login: 'Kirish',
      register: 'Ro\'yxatdan o\'tish',
      noOrders: 'Sizda hali buyurtmalar yo\'q',
    },
    // About
    about: {
      title: 'Biz haqimizda',
      subtitle: 'Keyllect — o\'yin periferiyasi dunyosida ishonchli hamkoringiz',
      mission: 'Bizning maqsadimiz',
      missionText: 'Biz geymerlarga va mutaxassislarga eng yaxshi uskunalarni hamyonbop narxlarda taqdim etishga intilamiz.',
      values: 'Bizning qadriyatlarimiz',
      quality: 'Sifat',
      qualityText: 'Faqat tasdiqlangan brendlardan original mahsulotlar',
      service: 'Xizmat',
      serviceText: 'Professional maslahat va qo\'llab-quvvatlash',
      trust: 'Ishonch',
      trustText: 'O\'zbekiston bo\'ylab minglab mamnun mijozlar',
    },
    // Contacts
    contacts: {
      title: 'Kontaktlar',
      subtitle: 'Biz bilan bog\'laning',
      address: 'Manzil',
      addressValue: 'Toshkent sh., Amir Temur ko\'chasi, 1',
      phone: 'Telefon',
      email: 'Email',
      workHours: 'Ish vaqti',
      workHoursValue: 'Du-Ya: 09:00 - 21:00',
      sendMessage: 'Xabar yuborish',
      name: 'Ismingiz',
      message: 'Xabar',
      send: 'Yuborish',
    },
    // Common
    common: {
      currency: 'so\'m',
      loading: 'Yuklanmoqda...',
      error: 'Xatolik yuz berdi',
      notFound: 'Sahifa topilmadi',
      back: 'Orqaga',
      next: 'Keyingi',
      prev: 'Oldingi',
      close: 'Yopish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      confirm: 'Tasdiqlash',
      search: 'Qidirish',
      noResults: 'Hech narsa topilmadi',
    },
  },
} as const

export type TranslationKey = keyof typeof translations.ru

export function getTranslation(locale: Locale) {
  return translations[locale]
}

export function formatPrice(price: number, locale: Locale = 'ru'): string {
  const formatted = new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'uz-UZ').format(price)
  const currency = translations[locale].common.currency
  return `${formatted} ${currency}`
}

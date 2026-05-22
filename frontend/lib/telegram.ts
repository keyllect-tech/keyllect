import axios from 'axios';

export const sendTelegramNotification = async (order: any, items: any[]) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials are not configured");
    return;
  }

  const itemsText = items.map(
    item => `• ${item.product.name} × ${item.quantity}`
  ).join('\n');

  const dateStr = new Date(order.createdAt).toLocaleDateString('ru-RU');

  const text = `
🛒 *Новый заказ #${order.orderNumber}*

👤 *Клиент:* ${order.clientName}
📞 *Телефон:* ${order.phone}
${order.telegram ? `✈️ *Telegram:* @${order.telegram}` : ''}
📍 *Адрес:* ${order.address}

📦 *Товары:*
${itemsText}

💰 *Сумма:* ${order.totalAmount.toLocaleString('ru-RU')} сум

🕒 *Дата заказа:* ${dateStr}
  `.trim();

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error("Failed to send telegram notification:", error);
  }
};

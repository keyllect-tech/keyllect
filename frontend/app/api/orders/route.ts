import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendTelegramNotification } from '@/lib/telegram';

const isAdmin = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return false;
  return !!verifyToken(token);
};

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const orders = await db.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, phone, telegram, address, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }

    // Generate simple order number
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    let totalAmount = 0;
    
    // Validate products and calculate total
    const orderItemsData = [];
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = await db.order.create({
      data: {
        orderNumber,
        clientName,
        phone,
        telegram,
        address,
        totalAmount,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    // Send Telegram Notification async
    sendTelegramNotification(order, order.items).catch(console.error);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}

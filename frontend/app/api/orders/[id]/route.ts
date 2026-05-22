import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const isAdmin = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return false;
  return !!verifyToken(token);
};

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { status } = await req.json();
    const order = await db.order.update({
      where: { id: params.id },
      data: { status }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const isAdmin = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return false;
  return !!verifyToken(token);
};

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const category = await db.category.create({ data: body });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}

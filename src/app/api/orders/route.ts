import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';
import '@/models';

// POST /api/orders — Create a new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Generate order code if not provided
    if (!body.code) {
      body.code = `FB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    const order = await Order.create(body);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Order create error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

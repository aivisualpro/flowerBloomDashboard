import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';
import '@/models';

// GET /api/ongoingOrder/lists/user/[userId] — Get user's ongoing orders
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;
  try {
    await connectDB();
    const orders = await Order.find({
      user: userId,
      status: { $in: ['pending', 'confirmed', 'shipped'] }
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Ongoing orders error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

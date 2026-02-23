import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';
import '@/models';

// GET /api/orders/lists/current-latest-order/[userId] — Get user's latest current order
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;
  try {
    await connectDB();
    const order = await Order.findOne({
      user: userId,
      status: { $in: ['pending', 'confirmed', 'shipped'] }
    })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Current latest order error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

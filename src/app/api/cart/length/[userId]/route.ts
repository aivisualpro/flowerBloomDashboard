import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// GET /api/cart/length/[userId] — Get cart item count for a user
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;
  try {
    await connectDB();
    const cart = await Cart.findOne({ customer: userId });

    const distinct = cart ? cart.items.length : 0;

    return NextResponse.json({ success: true, data: { distinct } });
  } catch (error: any) {
    console.error('Cart length error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

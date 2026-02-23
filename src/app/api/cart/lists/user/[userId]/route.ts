import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// GET /api/cart/lists/user/[userId] — Get cart by user ID (website pattern)
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;
  try {
    await connectDB();
    let cart = await Cart.findOne({ customer: userId })
      .populate({
        path: 'items.product',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      });

    if (!cart) {
      cart = await Cart.create({ customer: userId, items: [], subtotal: 0 });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart by user error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

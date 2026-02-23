import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// GET /api/cart/lists — List all carts (admin/debug)
export async function GET() {
  try {
    await connectDB();
    const carts = await Cart.find()
      .populate('customer', 'firstName lastName email')
      .populate({
        path: 'items.product',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      })
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: carts });
  } catch (error: any) {
    console.error('Cart lists error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

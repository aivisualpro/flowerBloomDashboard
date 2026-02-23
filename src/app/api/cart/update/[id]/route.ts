import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// PUT /api/cart/update/[id] — Update cart by cart ID
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectDB();
    const body = await req.json();

    const cart = await Cart.findByIdAndUpdate(id, body, { new: true })
      .populate({
        path: 'items.product',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      });

    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart update error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

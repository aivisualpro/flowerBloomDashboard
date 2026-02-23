import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// PATCH /api/cart/items/update/[productId] — Set quantity { user, qty }
export async function PATCH(req: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const { productId } = await props.params;
  try {
    await connectDB();
    const { user, qty } = await req.json();

    if (!user) {
      return NextResponse.json({ success: false, message: 'User is required' }, { status: 400 });
    }

    const cart = await Cart.findOne({ customer: user });
    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    const itemIdx = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIdx === -1) {
      return NextResponse.json({ success: false, message: 'Item not found in cart' }, { status: 404 });
    }

    if (qty <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      cart.items[itemIdx].quantity = qty;
      cart.items[itemIdx].totalAmount = qty * cart.items[itemIdx].price;
    }

    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    await cart.save();

    await cart.populate({
      path: 'items.product',
      populate: [
        { path: 'brand', select: 'name ar_name' },
        { path: 'categories', select: 'name ar_name slug' }
      ]
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart item update error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

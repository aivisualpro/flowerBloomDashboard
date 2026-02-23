import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// DELETE /api/cart/items/delete — Remove items from cart { user, productIds: [...] }
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { user, productIds = [] } = await req.json();

    if (!user) {
      return NextResponse.json({ success: false, message: 'User is required' }, { status: 400 });
    }

    const cart = await Cart.findOne({ customer: user });
    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item: any) => !productIds.includes(item.product.toString())
    );

    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    await cart.save();

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart items delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

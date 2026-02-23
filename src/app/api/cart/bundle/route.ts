import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart, Product } from '@/models';
import '@/models';

// POST /api/cart/bundle — Add multiple items at once { user, items: [{product, qty}, ...] }
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { user, items = [] } = await req.json();

    if (!user || !items.length) {
      return NextResponse.json({ success: false, message: 'User and items are required' }, { status: 400 });
    }

    let cart = await Cart.findOne({ customer: user });
    if (!cart) {
      cart = new Cart({ customer: user, items: [], subtotal: 0 });
    }

    for (const { product: productId, qty = 1 } of items) {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) continue;

      const effectivePrice = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      const existingIdx = cart.items.findIndex(
        (item: any) => item.product.toString() === productId
      );

      if (existingIdx > -1) {
        cart.items[existingIdx].quantity += qty;
        cart.items[existingIdx].totalAmount = cart.items[existingIdx].quantity * effectivePrice;
      } else {
        cart.items.push({
          product: productId,
          quantity: qty,
          price: effectivePrice,
          totalAmount: qty * effectivePrice
        });
      }
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
    console.error('Cart bundle error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

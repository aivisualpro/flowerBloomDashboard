import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart, Product } from '@/models';
import '@/models';

// POST /api/cart/items — Add item to cart { user, product, qty }
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { user, product: productId, qty = 1 } = await req.json();

    if (!user || !productId) {
      return NextResponse.json({ success: false, message: 'User and product are required' }, { status: 400 });
    }

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, message: 'Product not found or inactive' }, { status: 404 });
    }

    const effectivePrice = product.discount > 0
      ? product.price - (product.price * product.discount / 100)
      : product.price;

    let cart = await Cart.findOne({ customer: user });
    if (!cart) {
      cart = new Cart({ customer: user, items: [], subtotal: 0 });
    }

    // Check if product already in cart
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
    console.error('Cart items add error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

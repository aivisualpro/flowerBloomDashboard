import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart, Product } from '@/models';
import { verifyCustomerToken } from '@/lib/auth';
import '@/models';

// GET /api/cart — Get customer's cart
export async function GET(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let cart = await Cart.findOne({ customer: auth.id })
      .populate({
        path: 'items.product',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      });

    if (!cart) {
      cart = await Cart.create({ customer: auth.id, items: [], subtotal: 0 });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/cart — Add item to cart
export async function POST(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    // Validate product exists and get price
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, message: 'Product not found or inactive' }, { status: 404 });
    }

    const effectivePrice = product.discount > 0
      ? product.price - (product.price * product.discount / 100)
      : product.price;

    let cart = await Cart.findOne({ customer: auth.id });
    if (!cart) {
      cart = new Cart({ customer: auth.id, items: [], subtotal: 0 });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalAmount = cart.items[existingItemIndex].quantity * effectivePrice;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: effectivePrice,
        totalAmount: quantity * effectivePrice
      });
    }

    // Recalculate subtotal
    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    await cart.save();

    // Re-populate for response
    await cart.populate({
      path: 'items.product',
      populate: [
        { path: 'brand', select: 'name ar_name' },
        { path: 'categories', select: 'name ar_name slug' }
      ]
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/cart — Update item quantity in cart
export async function PUT(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json({ success: false, message: 'Product ID and quantity are required' }, { status: 400 });
    }

    const cart = await Cart.findOne({ customer: auth.id });
    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, message: 'Item not found in cart' }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].totalAmount = quantity * cart.items[itemIndex].price;
    }

    // Recalculate subtotal
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
    console.error('Cart PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/cart — Remove item from cart or clear cart
export async function DELETE(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const clearAll = searchParams.get('clearAll');

    const cart = await Cart.findOne({ customer: auth.id });
    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    if (clearAll === 'true') {
      cart.items = [];
      cart.subtotal = 0;
    } else if (productId) {
      cart.items = cart.items.filter(
        (item: any) => item.product.toString() !== productId
      );
      cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + item.totalAmount, 0);
    } else {
      return NextResponse.json({ success: false, message: 'productId or clearAll param is required' }, { status: 400 });
    }

    await cart.save();

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Wishlist } from '@/models';
import { verifyCustomerToken } from '@/lib/auth';
import '@/models';

// GET /api/wishlist — Get customer's wishlist
export async function GET(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let wishlist = await Wishlist.findOne({ customer: auth.id })
      .populate({
        path: 'products',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer: auth.id, products: [] });
    }

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/wishlist — Toggle product in wishlist (add if not present, remove if present)
export async function POST(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ customer: auth.id });
    if (!wishlist) {
      wishlist = new Wishlist({ customer: auth.id, products: [] });
    }

    const productIndex = wishlist.products.findIndex(
      (p: any) => p.toString() === productId
    );

    let action: string;
    if (productIndex > -1) {
      // Remove from wishlist
      wishlist.products.splice(productIndex, 1);
      action = 'removed';
    } else {
      // Add to wishlist
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();

    // Re-populate for response
    await wishlist.populate({
      path: 'products',
      populate: [
        { path: 'brand', select: 'name ar_name' },
        { path: 'categories', select: 'name ar_name slug' }
      ]
    });

    return NextResponse.json({ success: true, action, data: wishlist });
  } catch (error: any) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/wishlist — Remove specific product or clear all
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

    const wishlist = await Wishlist.findOne({ customer: auth.id });
    if (!wishlist) {
      return NextResponse.json({ success: false, message: 'Wishlist not found' }, { status: 404 });
    }

    if (clearAll === 'true') {
      wishlist.products = [];
    } else if (productId) {
      wishlist.products = wishlist.products.filter(
        (p: any) => p.toString() !== productId
      );
    } else {
      return NextResponse.json({ success: false, message: 'productId or clearAll param is required' }, { status: 400 });
    }

    await wishlist.save();

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error: any) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

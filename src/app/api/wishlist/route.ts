import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Wishlist } from '@/models';
import { verifyCustomerToken } from '@/lib/auth';
import '@/models';

// Helper to get user ID from either JWT or body
async function getUserId(req: NextRequest, body?: any): Promise<string | null> {
  // Try JWT first
  const auth = verifyCustomerToken(req);
  if (auth) return auth.id;
  // Fall back to body.user (website pattern)
  if (body?.user) return body.user;
  return null;
}

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

// POST /api/wishlist — Add product to wishlist
// Supports both JWT auth ({ productId }) and website pattern ({ user, product })
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const userId = await getUserId(req, body);
    const productId = body.productId || body.product;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User identification required' }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ customer: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ customer: userId, products: [] });
    }

    const productIndex = wishlist.products.findIndex(
      (p: any) => p.toString() === productId
    );

    let action: string;
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      action = 'removed';
    } else {
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();

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

// DELETE /api/wishlist — Remove product from wishlist
// Supports JWT auth (query params) and website pattern (body: { user, product })
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Try reading body for website pattern
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // No body — use query params
    }

    const userId = await getUserId(req, body);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User identification required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId') || body.product;
    const clearAll = searchParams.get('clearAll');

    const wishlist = await Wishlist.findOne({ customer: userId });
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

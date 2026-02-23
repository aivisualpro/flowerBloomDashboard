import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Wishlist } from '@/models';
import '@/models';

// GET /api/wishlist/lists/user/[userId] — Get wishlist by user ID
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const { userId } = await props.params;
  try {
    await connectDB();
    let wishlist = await Wishlist.findOne({ customer: userId })
      .populate({
        path: 'products',
        populate: [
          { path: 'brand', select: 'name ar_name' },
          { path: 'categories', select: 'name ar_name slug' }
        ]
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ customer: userId, products: [] });
    }

    return NextResponse.json({ success: true, data: wishlist.products || [] });
  } catch (error: any) {
    console.error('Wishlist by user error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

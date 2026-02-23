import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Occasion } from '@/models';
import '@/models';

// GET /api/product/lists/inFriendsOccasion
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const occasion = await Occasion.findOne({
      $or: [{ slug: { $regex: /friend/i } }, { name: { $regex: /friend/i } }],
      isActive: true
    });

    if (!occasion) {
      return NextResponse.json({ success: true, data: [], meta: { hasNext: false } });
    }

    const filter = { occasions: occasion._id, isActive: true };
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('brand').populate('categories').populate('occasions').populate('colors')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true, data: products,
      meta: { total, page, limit, hasNext: page * limit < total }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

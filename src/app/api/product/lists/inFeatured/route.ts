import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models';

// GET /api/product/lists/inFeatured — Products marked as featured
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const filter = { isFeatured: true, isActive: true };
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

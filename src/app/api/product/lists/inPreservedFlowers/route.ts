import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Category, SubCategory } from '@/models';
import '@/models';

// GET /api/product/lists/inPreservedFlowers
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [category, subCategory] = await Promise.all([
      Category.findOne({
        $or: [{ slug: { $regex: /preserved.*flower/i } }, { name: { $regex: /preserved.*flower/i } }],
        isActive: true
      }),
      SubCategory.findOne({
        $or: [{ slug: { $regex: /preserved.*flower/i } }, { name: { $regex: /preserved.*flower/i } }],
        isActive: true
      })
    ]);

    const catId = subCategory?._id || category?._id;
    if (!catId) {
      return NextResponse.json({ success: true, data: [], meta: { hasNext: false } });
    }

    const filter = { categories: catId, isActive: true };
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

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Category, SubCategory } from '@/models';
import '@/models';

// GET /api/product/lists/inChocolatesOrHandBouquets
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Search both Category and SubCategory
    const [cats, subCats] = await Promise.all([
      Category.find({
        $or: [
          { slug: { $regex: /chocolate/i } },
          { name: { $regex: /chocolate/i } },
          { slug: { $regex: /hand.*bouquet/i } },
          { name: { $regex: /hand.*bouquet/i } }
        ],
        isActive: true
      }),
      SubCategory.find({
        $or: [
          { slug: { $regex: /chocolate/i } },
          { name: { $regex: /chocolate/i } },
          { slug: { $regex: /hand.*bouquet/i } },
          { name: { $regex: /hand.*bouquet/i } }
        ],
        isActive: true
      })
    ]);

    const allIds = [...cats.map(c => c._id), ...subCats.map(c => c._id)];

    if (allIds.length === 0) {
      return NextResponse.json({ success: true, data: [], meta: { hasNext: false }, message: 'Categories not found' });
    }

    const filter = { categories: { $in: allIds }, isActive: true };
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('brand')
        .populate('categories')
        .populate('occasions')
        .populate('colors')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { total, page, limit, hasNext: page * limit < total }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

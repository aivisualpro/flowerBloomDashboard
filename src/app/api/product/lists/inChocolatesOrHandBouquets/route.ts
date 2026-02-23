import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Category } from '@/models';
import '@/models';

// GET /api/product/lists/inChocolatesOrHandBouquets — Products in "Chocolates" or "Hand Bouquets" categories
export async function GET() {
  try {
    await connectDB();

    // Find categories matching chocolates or hand bouquets
    const categories = await Category.find({
      $or: [
        { slug: { $regex: /chocolate/i } },
        { name: { $regex: /chocolate/i } },
        { slug: { $regex: /hand.*bouquet/i } },
        { name: { $regex: /hand.*bouquet/i } }
      ],
      isActive: true
    });

    if (categories.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'Categories not found' });
    }

    const categoryIds = categories.map(c => c._id);
    const products = await Product.find({
      categories: { $in: categoryIds },
      isActive: true
    })
      .populate('brand')
      .populate('categories')
      .populate('occasions')
      .populate('colors')
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

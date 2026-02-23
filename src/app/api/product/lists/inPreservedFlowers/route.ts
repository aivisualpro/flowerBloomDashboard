import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Category } from '@/models';
import '@/models';

// GET /api/product/lists/inPreservedFlowers — Products in the "Preserved Flowers" category
export async function GET() {
  try {
    await connectDB();

    const category = await Category.findOne({
      $or: [
        { slug: { $regex: /preserved.*flower/i } },
        { name: { $regex: /preserved.*flower/i } }
      ],
      isActive: true
    });

    if (!category) {
      return NextResponse.json({ success: true, data: [], message: 'Category not found' });
    }

    const products = await Product.find({ categories: category._id, isActive: true })
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

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models';

// GET /api/product/lists/inFeatured — Products marked as featured
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true, isActive: true })
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

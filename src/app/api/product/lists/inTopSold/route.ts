import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models';

// GET /api/product/lists/inTopSold — Top sold products sorted by totalPieceSold
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, totalPieceSold: { $gt: 0 } })
      .populate('brand')
      .populate('categories')
      .populate('occasions')
      .populate('colors')
      .sort({ totalPieceSold: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

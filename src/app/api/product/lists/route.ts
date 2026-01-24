import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models'; // ensure all schemas are registered for population


export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const stockStatus = searchParams.get('stockStatus');
    
    let filter: any = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } }
      ];
    }
    if (stockStatus && stockStatus !== 'all') {
      filter.stockStatus = stockStatus;
    }

    const products = await Product.find(filter)
      .populate('brand')
      .populate('categories')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
      rows: products // Frontend seems to expect .rows or .data depending on hook
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

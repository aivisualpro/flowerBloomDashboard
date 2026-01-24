import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}, 'title _id').sort({ title: 1 });
    return NextResponse.json({
      success: true,
      data: products,
      rows: products
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

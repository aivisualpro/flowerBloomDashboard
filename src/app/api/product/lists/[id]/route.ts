import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models';
import '@/models';


export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const id = params.id;
    const product = await Product.findById(id)
      .populate('brand')
      .populate('categories')
      .populate('occasions')
      .populate('recipients')
      .populate('colors')
      .populate('packagingOption')
      .populate('type');

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

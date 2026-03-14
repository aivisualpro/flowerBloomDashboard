import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const params = await props.params;
    const id = params.id;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

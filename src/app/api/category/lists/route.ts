import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const q = searchParams.get('q');

    let filter: any = {};
    if (id) {
      filter._id = id;
    }
    if (status && status !== 'all') {
      filter.isActive = status === 'active';
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { ar_name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: categories,
      rows: categories
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

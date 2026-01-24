import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
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

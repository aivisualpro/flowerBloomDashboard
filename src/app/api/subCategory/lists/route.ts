
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { SubCategory } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Populate parent category if needed, assuming 'category' field exists in SubCategory model
    const list = await SubCategory.find().populate('category').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

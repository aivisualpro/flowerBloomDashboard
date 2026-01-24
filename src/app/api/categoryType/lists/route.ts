
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CategoryType } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const list = await CategoryType.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: users,
      rows: users
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

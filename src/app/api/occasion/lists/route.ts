import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Occasion from '@/models/Occasion';

export async function GET() {
  try {
    await connectDB();
    const data = await Occasion.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data, rows: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

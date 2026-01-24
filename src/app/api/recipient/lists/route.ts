import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Recipient from '@/models/Recipient';

export async function GET() {
  try {
    await connectDB();
    const data = await Recipient.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data, rows: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

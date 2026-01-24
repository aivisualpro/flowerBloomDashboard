import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Recipient } from '@/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const doc = await Recipient.create(data);
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

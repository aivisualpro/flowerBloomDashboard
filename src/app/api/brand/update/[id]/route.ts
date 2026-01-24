import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Brand } from '@/models';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();
    const doc = await Brand.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

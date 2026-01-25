import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Brand } from '@/models';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const doc = await Brand.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

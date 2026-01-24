import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Color } from '@/models';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Color.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

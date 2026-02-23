import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/models';
import '@/models';

// PUT /api/user/update/[id] — Update user profile
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectDB();
    const body = await req.json();

    const customer = await Customer.findByIdAndUpdate(id, body, { new: true }).select('-password');
    if (!customer) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error: any) {
    console.error('User update error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

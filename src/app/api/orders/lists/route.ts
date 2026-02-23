import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order, Customer } from '@/models';
import '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    let filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
      rows: orders
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

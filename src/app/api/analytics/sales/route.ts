import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Group sales by some criteria or just return a mock breakdown for now to stop 404
    const sales = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedAt" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json(sales);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

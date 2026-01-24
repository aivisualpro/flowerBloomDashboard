import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const year = new Date().getFullYear();
    const monthly = await Order.aggregate([
      {
        $match: {
          placedAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$placedAt" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing months
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthly.find(m => m._id === i + 1);
      return { month: i + 1, orders: monthData ? monthData.orders : 0 };
    });

    return NextResponse.json({ success: true, monthly: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    
    const [orders, totalProducts] = await Promise.all([
      Order.find({}),
      Product.countDocuments()
    ]);

    const netProfit = orders
      .filter((o: any) => o.status === 'delivered')
      .reduce((sum: number, o: any) => sum + (o.amount || 0), 0);

    const ordersDelivered = orders.filter((o: any) => o.status === 'delivered').length;
    const expectedAmount = orders
      .filter((o: any) => o.status !== 'cancelled' && o.status !== 'returned')
      .reduce((sum: number, o: any) => sum + (o.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        netProfit,
        ordersDelivered,
        totalProducts,
        expectedAmount
      }
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

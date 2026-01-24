import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const [salesData, ordersCount, productsCount, usersCount] = await Promise.all([
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, totalSales: { $sum: '$amount' } } }
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments()
    ]);

    const data = {
      success: true,
      sales: salesData[0]?.totalSales || 0,
      orders: ordersCount,
      products: productsCount,
      users: usersCount
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

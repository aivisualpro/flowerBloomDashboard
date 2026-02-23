import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product, Occasion } from '@/models';
import '@/models';

// GET /api/product/lists/inFriendsOccasion — Products tagged with the "Friends" occasion
export async function GET() {
  try {
    await connectDB();

    const occasion = await Occasion.findOne({
      $or: [
        { slug: { $regex: /friend/i } },
        { name: { $regex: /friend/i } }
      ],
      isActive: true
    });

    if (!occasion) {
      return NextResponse.json({ success: true, data: [], message: 'Occasion not found' });
    }

    const products = await Product.find({ occasions: occasion._id, isActive: true })
      .populate('brand')
      .populate('categories')
      .populate('occasions')
      .populate('colors')
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

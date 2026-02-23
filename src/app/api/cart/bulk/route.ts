import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// DELETE /api/cart/bulk — Bulk delete carts { ids: [...] }
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { ids = [] } = await req.json();

    if (!ids.length) {
      return NextResponse.json({ success: false, message: 'IDs array is required' }, { status: 400 });
    }

    await Cart.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ success: true, message: `${ids.length} carts deleted` });
  } catch (error: any) {
    console.error('Cart bulk delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

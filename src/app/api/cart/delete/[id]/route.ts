import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models';
import '@/models';

// DELETE /api/cart/delete/[id] — Delete a cart by ID
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await connectDB();
    const cart = await Cart.findByIdAndDelete(id);

    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Cart deleted' });
  } catch (error: any) {
    console.error('Cart delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

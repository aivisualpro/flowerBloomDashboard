import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/models';
import '@/models';

// GET /api/coupon/[id] — Get a specific coupon by ID
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const coupon = await Coupon.findById(params.id)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'title');

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error: any) {
    console.error('Coupon GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/coupon/[id] — Update a coupon
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const body = await req.json();

    const coupon = await Coupon.findById(params.id);
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    // If code is being changed, check for duplicates
    if (body.code && body.code.toUpperCase() !== coupon.code) {
      const existing = await Coupon.findOne({ code: body.code.toUpperCase(), _id: { $ne: params.id } });
      if (existing) {
        return NextResponse.json({ success: false, message: 'A coupon with this code already exists' }, { status: 409 });
      }
      body.code = body.code.toUpperCase();
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true })
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'title');

    return NextResponse.json({ success: true, data: updatedCoupon });
  } catch (error: any) {
    console.error('Coupon PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/coupon/[id] — Delete a coupon
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(params.id);

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    console.error('Coupon DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

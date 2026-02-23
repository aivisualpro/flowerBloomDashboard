import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/models';
import '@/models';

// POST /api/coupon/check — Check/validate a coupon code { code, cartTotal }
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code' }, { status: 404 });
    }

    // Validate dates
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json({ success: false, message: 'Coupon is not yet active' }, { status: 400 });
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      return NextResponse.json({ success: false, message: 'Coupon has expired' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: 'Coupon usage limit reached' }, { status: 400 });
    }

    // Check minimum order amount
    if (cartTotal !== undefined && coupon.minOrderAmount > 0 && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `Minimum order amount of ${coupon.minOrderAmount} QAR required`
      }, { status: 400 });
    }

    // Calculate discount if cartTotal provided
    let discount = 0;
    if (cartTotal !== undefined) {
      if (coupon.type === 'percentage') {
        discount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }
      if (discount > cartTotal) discount = cartTotal;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        discount: Math.round(discount * 100) / 100,
        newTotal: cartTotal !== undefined ? Math.round((cartTotal - discount) * 100) / 100 : undefined
      }
    });
  } catch (error: any) {
    console.error('Coupon check error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

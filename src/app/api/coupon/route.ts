import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Coupon } from '@/models';
import '@/models';

// GET /api/coupon — List all coupons (admin) or validate a coupon code (website)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      // Validate a specific coupon code (for website use)
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

      if (!coupon) {
        return NextResponse.json({ success: false, message: 'Invalid coupon code' }, { status: 404 });
      }

      // Check expiry
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return NextResponse.json({ success: false, message: 'Coupon has expired' }, { status: 400 });
      }

      // Check start date
      if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
        return NextResponse.json({ success: false, message: 'Coupon is not yet active' }, { status: 400 });
      }

      // Check usage limit
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ success: false, message: 'Coupon usage limit reached' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscount: coupon.maxDiscount
        }
      });
    }

    // List all coupons (admin view)
    const coupons = await Coupon.find()
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    console.error('Coupon GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/coupon — Create a new coupon
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      startDate,
      expiryDate,
      isActive,
      applicableCategories,
      applicableProducts
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Code, type, and value are required'
      }, { status: 400 });
    }

    if (!['percentage', 'fixed'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Type must be "percentage" or "fixed"'
      }, { status: 400 });
    }

    // Check for duplicate code
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'A coupon with this code already exists'
      }, { status: 409 });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || undefined,
      usageLimit: usageLimit || 0,
      startDate: startDate || undefined,
      expiryDate: expiryDate || undefined,
      isActive: isActive !== undefined ? isActive : true,
      applicableCategories: applicableCategories || [],
      applicableProducts: applicableProducts || []
    });

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error: any) {
    console.error('Coupon POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

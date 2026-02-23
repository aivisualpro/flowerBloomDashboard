import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart, Order, Customer } from '@/models';
import { verifyCustomerToken } from '@/lib/auth';
import stripe from '@/lib/stripe';
import '@/models';

// POST /api/cart/checkout — Create Stripe checkout session
export async function POST(req: NextRequest) {
  try {
    const auth = verifyCustomerToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { shippingAddress, couponCode } = await req.json();

    // Get the customer's cart
    const cart = await Cart.findOne({ customer: auth.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    // Get customer details
    const customer = await Customer.findById(auth.id);
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = customer.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone || undefined,
        metadata: { customerId: customer._id.toString() }
      });
      stripeCustomerId = stripeCustomer.id;
      customer.stripeCustomerId = stripeCustomerId;
      await customer.save();
    }

    // Build line items for Stripe
    const lineItems = cart.items.map((item: any) => ({
      price_data: {
        currency: cart.currency.toLowerCase(),
        product_data: {
          name: item.product.title,
          description: item.product.description?.substring(0, 200) || undefined,
          images: item.product.featuredImage ? [item.product.featuredImage] : []
        },
        unit_amount: Math.round(item.price * 100) // Stripe expects amount in smallest currency unit
      },
      quantity: item.quantity
    }));

    // Generate unique order code
    const orderCode = `FB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-success?session_id={CHECKOUT_SESSION_ID}&order=${orderCode}`,
      cancel_url: `${req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        customerId: auth.id,
        orderCode,
        couponCode: couponCode || ''
      },
      shipping_address_collection: {
        allowed_countries: ['QA', 'AE', 'SA', 'KW', 'BH', 'OM']
      }
    });

    // Create order record (pending payment)
    await Order.create({
      code: orderCode,
      user: auth.id,
      status: 'pending',
      payment: 'pending',
      amount: cart.subtotal,
      grandTotal: cart.subtotal,
      items: cart.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        totalAmount: item.totalAmount
      })),
      shippingAddress: shippingAddress || {},
      paymentMethod: 'stripe',
      transactionId: session.id,
      appliedCoupon: couponCode ? { code: couponCode } : undefined
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

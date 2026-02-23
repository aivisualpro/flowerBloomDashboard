import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order, Cart, Coupon } from '@/models';
import stripe from '@/lib/stripe';
import '@/models';

// POST /api/cart/webhook — Stripe webhook for payment events
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    // If webhook secret is configured, verify signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      event = JSON.parse(body);
    }

    await connectDB();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { customerId, orderCode, couponCode } = session.metadata || {};

        if (orderCode) {
          // Update order status
          await Order.findOneAndUpdate(
            { code: orderCode },
            {
              payment: 'paid',
              status: 'confirmed',
              transactionId: session.payment_intent
            }
          );

          // Clear customer's cart
          if (customerId) {
            await Cart.findOneAndUpdate(
              { customer: customerId },
              { items: [], subtotal: 0 }
            );
          }

          // Increment coupon usage
          if (couponCode) {
            await Coupon.findOneAndUpdate(
              { code: couponCode.toUpperCase() },
              { $inc: { usedCount: 1 } }
            );
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const { orderCode } = session.metadata || {};

        if (orderCode) {
          await Order.findOneAndUpdate(
            { code: orderCode },
            { payment: 'failed', status: 'cancelled', cancelReason: 'Payment session expired' }
          );
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

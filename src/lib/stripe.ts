import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
  apiVersion: '2026-01-28.clover'
});

export default stripe;

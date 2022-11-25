import Stripe from 'stripe';

const { STRIPE_SECRET_KEY } = process.env;

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'Next.js with Stripe',
    version: '0.0.1',
  },
});

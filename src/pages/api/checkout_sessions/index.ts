import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
import { stripe } from '@/common/lib/stripe';

import { formatAmountForStripe } from '@/common/utils/stripe-utils/format-amount-for-stripe.util';

import { TCartProduct } from '@/common/types/cart-product.type';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, headers, body } = request;

  if (method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).end('Method Not Allowed');
  }

  try {
    const products = body.products as Array<TCartProduct>;

    const lineItems = products.map(({ product, quantity }) => {
      const formattedPrice = formatAmountForStripe(product.price, 'BRL');

      return {
        price_data: {
          currency: 'BRL',
          unit_amount: formattedPrice,
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image],
          },
        },
        quantity,
      };
    });

    const params = {
      mode: 'payment',
      payment_method_types: ['card', 'boleto'],
      line_items: lineItems,
      success_url: `${headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headers.origin}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(
      params as Stripe.Checkout.SessionCreateParams,
    );

    response.status(200).json(checkoutSession);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    response.status(500).json({ statusCode: 500, message: errorMessage });
  }
}

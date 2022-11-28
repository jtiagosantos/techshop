import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';
import Stripe from 'stripe';

import { SendEmailService } from '@/adapters/nodemailer/services/send-email.service';

import { stripe } from '@/common/lib/stripe';

import { buffer } from '@/common/utils/buffer';
import { formatPrice } from '@/common/utils/format-price.util';
import { formatAmountFromStripe } from '@/common/utils/stripe-utils/format-amount-from-stripe.util';

const { STRIPE_WEBHOOK_SECRET } = process.env;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (
  request: NextApiRequest,
  response: NextApiResponse,
) => {
  const { method } = request;

  if (method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(request);
  const signature = request.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature!,
      STRIPE_WEBHOOK_SECRET,
    );

    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const name = checkoutSession.customer_details?.name;
    const email = checkoutSession.customer_details?.email;
    const amount = checkoutSession?.amount_total;

    if (event.type === 'checkout.session.completed') {
      const formattedAmountFromStripe = formatAmountFromStripe(amount!, 'BRL');
      const formattedPrice = formatPrice(formattedAmountFromStripe);

      await SendEmailService.execute({
        from: 'techshop@contact.com',
        to: email || '',
        subject: 'Pagamento',
        body: [
          `<h3>Olá, ${name}</h3>`,
          `<p style="font-size: 1rem">Passando para avisar você que o seu pagamento de ${formattedPrice} foi aprovado.</p>`,
          `<p style="text-align: center">A Techshop agradece por sua compra conosco!💜</p>`,
        ].join('\n'),
      });
    } else if (event.type === 'checkout.session.async_payment_failed') {
      await SendEmailService.execute({
        from: 'techshop@contact.com',
        to: email || '',
        subject: 'Pagamento',
        body: [
          `<h3>Olá, ${name}</h3>`,
          `<p style="font-size: 1rem">Passando para avisar você que ocorreu uma falha no seu pagamento. Por favor, tente novamente.</p>`,
          `<p style="text-align: center">A Techshop agradece a sua compreensão!💜</p>`,
        ].join('\n'),
      });
    }

    response.status(200).json({ ok: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    if (error! instanceof Error) {
      console.log(error);
    } else {
      console.log(`❌ Error message: ${errorMessage}`);
    }

    response.status(400).send(`Webhook handler failed: ${errorMessage}`);
  }
};

export default cors(webhookHandler as any);

import { api } from '@/common/lib/axios/api';
import { getStripe } from '@/common/lib/stripe-js/get-stripe';

import { IPaymentCheckout } from '../interfaces/payment-checkout.interface';

export class PaymentCheckoutService {
  public static async execute(data: IPaymentCheckout) {
    const response = await api.post('/api/checkout_sessions', {
      products: data,
    });

    const stripe = await getStripe();

    await stripe?.redirectToCheckout({ sessionId: response.data.id });
  }
}

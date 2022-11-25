import { stripe } from '@/common/lib/stripe';

import { formatAmountFromStripe } from '@/common/utils/stripe-utils/format-amount-from-stripe.util';

import { TProduct } from '../types/product.type';

export class FindManyProductsService {
  public static async execute(): Promise<Array<TProduct>> {
    const { data: productsData } = await stripe.products.list();
    const { data: pricesData } = await stripe.prices.list();

    const products = productsData.map((product, index) => {
      const price = pricesData[index].unit_amount as number;
      const formattedPrice = formatAmountFromStripe(price, 'BRL');

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        image: product.images[0],
        price: formattedPrice,
      };
    });

    return products;
  }
}

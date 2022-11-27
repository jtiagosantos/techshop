import type { TProduct } from '@/modules/product/types/product.type';

export type TCartProduct = {
  product: TProduct;
  quantity: number;
};

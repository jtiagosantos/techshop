import { TProduct } from '@/modules/product/types/product.type';

export type TCartProduct = {
  product: TProduct;
  quantity: number;
};

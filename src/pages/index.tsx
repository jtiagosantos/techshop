import { useState, Fragment } from 'react';
import { GetStaticProps } from 'next';
import {
  Flex,
  Heading,
  HStack,
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Divider,
} from '@chakra-ui/react';
import { ShoppingCartSimple, Code } from 'phosphor-react';

import { PaymentCheckoutService } from '@/modules/product/services/payment-checkout.service';
import { FindManyProductsService } from '@/modules/product/services/find-many-products.service';

import { formatPrice } from '@/common/utils/format-price.util';

import { Product, CartProduct } from '@/common/components';

import { TProduct } from '@/modules/product/types/product.type';
import { TCartProduct } from '@/common/types/cart-product.type';

type THomeServerProps = {
  products: TProduct[];
};

export default function Home({ products }: THomeServerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [cartProducts, setCartProducts] = useState<TCartProduct[]>([]);

  const totalQuantityCartProducts = cartProducts.reduce((acc, { quantity }) => {
    return acc + quantity;
  }, 0);
  const totalPriceCartProducts = cartProducts.reduce(
    (acc, { product, quantity }) => {
      return acc + product.price * quantity;
    },
    0,
  );

  const handleAddProductToCart = (product: TProduct) => {
    setCartProducts((prevState) => {
      const productIndex = prevState.findIndex(
        (cartItem) => cartItem.product.id === product.id,
      );

      if (productIndex < 0) {
        return [...prevState, { product, quantity: 1 }];
      }

      const cartItems = [...prevState];
      const productItem = cartItems[productIndex];

      cartItems[productIndex] = {
        ...productItem,
        quantity: productItem.quantity + 1,
      };

      return cartItems;
    });
  };

  const handleDecrementProductFromCart = (product: TProduct) => {
    setCartProducts((prevState) => {
      const productIndex = prevState.findIndex(
        (cartItem) => cartItem.product.id === product.id,
      );

      const cartItems = [...prevState];
      const productItem = cartItems[productIndex];

      cartItems[productIndex] = {
        ...productItem,
        quantity: productItem.quantity - 1,
      };

      return cartItems;
    });
  };

  const handleRemoveProductFromCart = (product: TProduct) => {
    const newCartProducts = cartProducts.filter(
      (cartProduct) => cartProduct.product.id !== product.id,
    );

    setCartProducts(newCartProducts);
  };

  const handlePaymentCheckout = () => {
    PaymentCheckoutService.execute(cartProducts);
  };

  return (
    <>
      <Flex
        as="header"
        w="full"
        bg="purple.900"
        p="24px"
        align="center"
        justify="space-between"
        position="fixed"
        top={0}
        zIndex={2}>
        <HStack color="purple.500">
          <Code size={36} weight="bold" />
          <Heading as="h1" fontSize="1.8rem">
            Techshop
          </Heading>
        </HStack>
        <Button
          bg="transparent"
          _hover={{ opacity: 0.7 }}
          _active={{ bg: 'transparent' }}
          onClick={onOpen}>
          <HStack color="gray.50" _hover={{ color: 'purple.500' }}>
            <ShoppingCartSimple size={30} />
            <Text>Carrinho ({totalQuantityCartProducts})</Text>
          </HStack>
        </Button>
      </Flex>

      <Flex
        as="main"
        maxW="1440px"
        mx="auto"
        mt="124px"
        mb="36px"
        justify="center"
        flexWrap="wrap"
        gap="36px">
        {products.map((product) => (
          <Product
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            onAddToCart={() => handleAddProductToCart(product)}
          />
        ))}
      </Flex>

      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent bg="gray.50">
          <DrawerCloseButton
            size="lg"
            color="purple.900"
            _hover={{ bg: 'purple.900', color: 'white' }}
          />
          <DrawerHeader color="gray.700">Carrinho</DrawerHeader>
          <DrawerBody>
            {cartProducts.length ? (
              cartProducts.map(({ product, quantity }) => (
                <Fragment key={product.id}>
                  <CartProduct
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      image: product.image,
                      price: product.price,
                    }}
                    quantity={quantity}
                    onIncrementProduct={() => handleAddProductToCart(product)}
                    onDecrementProduct={() =>
                      handleDecrementProductFromCart(product)
                    }
                    onRemoveProduct={() => handleRemoveProductFromCart(product)}
                  />
                  <Divider my={4} />
                </Fragment>
              ))
            ) : (
              <Text textAlign="center" mt="64px">
                Seu carrinho est?? vazio!
              </Text>
            )}
          </DrawerBody>
          {!!cartProducts.length && (
            <DrawerFooter>
              <Flex w="full" align="center" justify="space-between">
                <HStack>
                  <Text
                    fontSize="1.3rem"
                    fontWeight="semibold"
                    color="gray.700">
                    Total
                  </Text>
                  <Text fontWeight="medium">
                    {formatPrice(totalPriceCartProducts)}
                  </Text>
                </HStack>
                <Button
                  size="md"
                  bg="purple.700"
                  color="white"
                  fontWeight="normal"
                  _hover={{ opacity: 0.8 }}
                  _active={{ bg: 'purple.700' }}
                  onClick={handlePaymentCheckout}>
                  Finalizar pedido
                </Button>
              </Flex>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await FindManyProductsService.execute();

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};

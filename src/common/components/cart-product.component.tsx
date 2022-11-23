import { FC } from 'react';
import {
  Flex,
  HStack,
  Image,
  Box,
  Text,
  Heading,
  Button,
} from '@chakra-ui/react';
import { Minus, Plus, Trash } from 'phosphor-react';

import { formatPrice } from '@/common/utils/format-price.util';

import { TCartProduct } from '@/common/types/cart-product.types';

type TCartProductProps = TCartProduct & {
  onIncrementProduct: () => void;
  onDecrementProduct: () => void;
  onRemoveProduct: () => void;
};

export const CartProduct: FC<TCartProductProps> = ({
  product: { name, description, price, image },
  quantity,
  onIncrementProduct,
  onDecrementProduct,
  onRemoveProduct,
}) => {
  const totalPrice = price * quantity;

  return (
    <Flex align="center" justify="space-between">
      <Flex gap="12px">
        <Image
          src={image}
          alt={name}
          boxSize="100px"
          objectFit="cover"
          borderRadius="5px"
        />
        <Box>
          <Heading as="h3" size="sm" color="gray.700" mb="6px">
            {name}
          </Heading>
          <Text
            color="gray.600"
            fontSize="0.8rem"
            lineHeight="1rem"
            maxW="230px"
            maxH="32px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="revert">
            {description}
          </Text>
          <HStack spacing={8} mt="24px">
            <HStack spacing={3}>
              <Button
                w="24px"
                size="xs"
                bg="purple.700"
                color="white"
                rounded="full"
                _active={{ bg: 'purple.700' }}
                _hover={{ opacity: 0.8 }}
                disabled={quantity === 1}
                onClick={onDecrementProduct}>
                <Minus weight="bold" />
              </Button>
              <Text color="gray.600">{quantity}</Text>
              <Button
                w="24px"
                size="xs"
                bg="purple.700"
                color="white"
                rounded="full"
                _active={{ bg: 'purple.700' }}
                _hover={{ opacity: 0.8 }}
                onClick={onIncrementProduct}>
                <Plus weight="bold" />
              </Button>
            </HStack>
            <Button
              size="xs"
              bg="transparent"
              color="purple.700"
              _active={{ bg: 'transparent' }}
              _hover={{ opacity: 0.8 }}
              onClick={onRemoveProduct}>
              <Trash size={22} weight="bold" />
            </Button>
          </HStack>
        </Box>
      </Flex>
      <Text fontWeight="medium">{formatPrice(totalPrice)}</Text>
    </Flex>
  );
};

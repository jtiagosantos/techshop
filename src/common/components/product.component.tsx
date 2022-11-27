import { FC } from 'react';
import {
  Card,
  CardBody,
  Divider,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';

import { formatPrice } from '@/common/utils/format-price.util';

import type { TProduct } from '@/modules/product/types/product.type';

type TProductProps = Omit<TProduct, 'id'> & {
  onAddToCart: () => void;
};

export const Product: FC<TProductProps> = ({
  name,
  description,
  price,
  image,
  onAddToCart,
}) => {
  return (
    <Card maxW="250px" bg="white">
      <CardBody p={3} mb="-10px">
        <Box w="226px" h="226px">
          <Image src={image} alt={name} w="full" h="full" objectFit="contain" />
        </Box>
        <Divider />
        <Stack mt={2}>
          <Heading as="h3" size="sm" color="gray.700">
            {name}
          </Heading>
          <Text
            h="32px"
            color="gray.600"
            fontSize="0.8rem"
            lineHeight="1rem"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap">
            {description}
          </Text>
          <Text color="purple.700" fontSize="xl" fontWeight="bold">
            {formatPrice(price)}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter p={3}>
        <Button
          w="full"
          variant="solid"
          bg="purple.700"
          color="white"
          fontWeight="normal"
          _hover={{ opacity: 0.8 }}
          _active={{ bg: 'purple.700' }}
          onClick={onAddToCart}>
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

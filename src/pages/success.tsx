import Router from 'next/router';
import { Flex, Text, Box, Button } from '@chakra-ui/react';
import { CheckCircle } from 'phosphor-react';
import Confetti from 'react-confetti';

export default function Success() {
  const handleBackToHomePage = () => {
    Router.push('/');
  };

  return (
    <Flex
      as="main"
      w="full"
      h="100vh"
      align="flex-start"
      justify="center"
      pt="96px"
      pos="relative"
      overflow="hidden">
      <Confetti width={1920} height={1080} style={{ margin: '0 auto' }} />
      <Flex
        flexDir="column"
        align="center"
        p={4}
        borderColor="gray.200"
        borderWidth={2}
        borderRadius="md">
        <CheckCircle size={60} color="#38A169" />
        <Box
          textAlign="center"
          mt={4}
          mb={8}
          fontWeight="medium"
          fontSize="xl"
          color="gray.600">
          <Text>Seu pagamento foi efetuado com sucesso.</Text>
          <Text>Obrigado por comprar na Techshop!</Text>
        </Box>
        <Button
          bg="purple.600"
          color="white"
          fontWeight="normal"
          _hover={{ opacity: 0.8 }}
          _active={{ br: 'purple.600' }}
          onClick={handleBackToHomePage}>
          Voltar para a página inicial
        </Button>
      </Flex>
    </Flex>
  );
}

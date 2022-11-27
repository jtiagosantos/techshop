import { extendTheme } from '@chakra-ui/react';
import type { Theme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        maxW: '1920px',
        w: '100%',
        mx: 'auto',
      },
    },
  },
  fonts: {
    body: 'Poppins',
    heading: 'Poppins',
  },
  colors: {},
} as Theme | Record<string, unknown>);

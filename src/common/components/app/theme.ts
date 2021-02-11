// import { theme } from '@chakra-ui/core';
import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

/* export const space = {
  ...theme.space,
  '4xs': '0.125rem',
  '3xs': '0.25rem',
  '2xs': '0.5rem',
  xs: '0.75rem',
  s: '1rem',
  m: '1.5rem',
  l: '2rem',
  xl: '2.5rem',
  '2xl': '3.0rem',
  '3xl': '3.5rem',
  '4xl': '4rem',
  '5xl': '4.5rem',
}; */

export const breakpoints = createBreakpoints({
  sm: '320px',
  md: '576px',
  lg: '768px',
  xl: '992px',
  xxl: '1248px',
});

const customTheme = extendTheme({
  // space,
  // breakpoints,
});

export default customTheme;

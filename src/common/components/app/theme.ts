import { extendTheme } from '@chakra-ui/react';

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

const breakpoints = {
  base: '0px',
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1248px',
};

const customTheme = extendTheme({
  breakpoints,
});

export default customTheme;

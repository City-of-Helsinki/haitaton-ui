import { Box, Flex, Grid } from '@chakra-ui/react';
import HaittaIndex from './HaittaIndex';
import React from 'react';

export function HaittaSubSection({
  heading,
  index,
  testId,
}: Readonly<{
  heading: string;
  index?: number;
  testId?: string;
}>) {
  return (
    <Grid
      templateColumns="1fr 24px"
      gap="var(--spacing-xs)"
      paddingX="var(--spacing-s)"
      paddingY="var(--spacing-xs)"
      _odd={{ backgroundColor: 'var(--color-black-5)' }}
      _even={{ backgroundColor: 'var(--color-black-10)' }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: 'wrap', sm: 'nowrap' }}
      >
        <Box as="p">{heading}</Box>
        <HaittaIndex index={index} showLabel={false} testId={testId} />
      </Flex>
    </Grid>
  );
}

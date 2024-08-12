import { Flex, Grid } from '@chakra-ui/react';
import HaittaIndex from './HaittaIndex';

export function HaittaSection({
  heading,
  index,
  testId,
  border = true,
  tooltipContent,
}: Readonly<{
  heading: string;
  index?: number;
  testId?: string;
  border?: boolean;
  tooltipContent?: React.ReactNode;
}>) {
  return (
    <Grid
      templateColumns="1fr 24px"
      gap="var(--spacing-xs)"
      padding="var(--spacing-s)"
      {...(border ? { borderBottom: '1px solid var(--color-black-30)' } : {})}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: 'wrap', sm: 'nowrap' }}
      >
        <p className="heading-xs">
          <strong>{heading}</strong>
        </p>
        <HaittaIndex index={index} testId={testId} tooltipContent={tooltipContent} />
      </Flex>
    </Grid>
  );
}

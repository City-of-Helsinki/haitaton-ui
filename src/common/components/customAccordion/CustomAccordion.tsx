import { Box, Flex, Grid } from '@chakra-ui/react';
import { IconAngleDown, IconAngleUp, useAccordion } from 'hds-react';
import React from 'react';

type Props = {
  heading: React.ReactNode;
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingBorderBottom?: boolean;
  headingBackgroundColor?: string;
  headingElement?: React.ReactNode;
  headingSize?: 'm' | 's';
  initiallyOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function CustomAccordion({
  heading,
  headingType = 'h2',
  headingBorderBottom = true,
  headingBackgroundColor,
  headingElement,
  headingSize = 'm',
  initiallyOpen = false,
  children,
  className,
}: Readonly<Props>) {
  const {
    isOpen,
    buttonProps: accordionButtonProps,
    contentProps: accordionContentProps,
  } = useAccordion({ initiallyOpen });
  const headingButtonIcon = isOpen ? <IconAngleUp size="s" /> : <IconAngleDown size="s" />;

  return (
    <div className={className}>
      <Box
        padding="var(--spacing-s)"
        backgroundColor={headingBackgroundColor}
        borderBottom={headingBorderBottom ? '1px solid var(--color-black-30)' : undefined}
        {...accordionButtonProps}
      >
        <Grid
          as="button"
          type="button"
          width="100%"
          templateColumns="1fr 24px"
          gap="var(--spacing-xs)"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexWrap={{ base: 'wrap', sm: 'nowrap' }}
          >
            <Box
              as={headingType}
              className={headingSize === 'm' ? 'heading-s' : 'heading-xs'}
              textAlign="start"
            >
              {heading}
            </Box>
            {headingElement}
          </Flex>
          {headingButtonIcon}
        </Grid>
      </Box>
      <div {...accordionContentProps}>{children}</div>
    </div>
  );
}

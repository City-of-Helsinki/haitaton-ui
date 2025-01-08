import { Box, BoxProps, Flex, Grid } from '@chakra-ui/react';
import { IconAngleDown, IconAngleUp, useAccordion } from 'hds-react';
import React from 'react';

type Props = {
  border?: boolean;
  accordionBorderBottom?: boolean;
  heading: React.ReactNode;
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subHeading?: React.ReactNode;
  headingBorderBottom?: boolean;
  headingBackgroundColor?: string;
  headingElement?: React.ReactNode;
  headingSize?: 'm' | 's';
  headingBoxProps?: BoxProps;
  strong?: boolean;
  initiallyOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function CustomAccordion({
  border = false,
  accordionBorderBottom = false,
  heading,
  headingType = 'h2',
  subHeading,
  headingBorderBottom = true,
  headingBackgroundColor,
  headingElement,
  headingSize = 'm',
  headingBoxProps,
  strong = false,
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
  const showHeadingBorderBottom =
    (headingBorderBottom && !accordionBorderBottom) || (accordionBorderBottom && isOpen);

  return (
    <Box
      border={border ? '1px solid var(--color-black-60)' : undefined}
      borderBottom={accordionBorderBottom ? '1px solid var(--color-black-60)' : undefined}
      className={className}
    >
      <Box
        padding="var(--spacing-s)"
        backgroundColor={headingBackgroundColor}
        borderBottom={showHeadingBorderBottom ? '1px solid var(--color-black-30)' : undefined}
        {...headingBoxProps}
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
            <div>
              <Box
                as={headingType}
                className={headingSize === 'm' ? 'heading-s' : 'heading-xs'}
                textAlign="start"
              >
                {strong ? <strong>{heading}</strong> : heading}
              </Box>
              {subHeading}
            </div>
            {headingElement}
          </Flex>
          {headingButtonIcon}
        </Grid>
      </Box>
      <div {...accordionContentProps}>{children}</div>
    </Box>
  );
}

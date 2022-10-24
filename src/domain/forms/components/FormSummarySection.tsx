import { Box, Grid } from '@chakra-ui/react';
import React from 'react';
import Text from '../../../common/components/text/Text';

const SectionTitle: React.FC = ({ children }) => {
  return (
    <Box mb="var(--spacing-m)">
      <Text tag="h2" styleAs="h3" weight="bold">
        {children}
      </Text>
    </Box>
  );
};

const SectionItemTitle: React.FC = ({ children }) => {
  return (
    <Box color="var(--color-black-90)">
      <Text tag="h3" styleAs="body-m" weight="bold">
        {children}
      </Text>
    </Box>
  );
};

const SectionItemContent: React.FC = ({ children }) => {
  return (
    <Box color="var(--color-black-60)">
      <p>{children}</p>
    </Box>
  );
};

const FormSummarySection: React.FC = ({ children }) => {
  return (
    <Grid
      as="section"
      templateColumns="1fr 4fr"
      columnGap="var(--spacing-xl)"
      rowGap="var(--spacing-m)"
      mb="var(--spacing-2-xl)"
    >
      {children}
    </Grid>
  );
};

export { FormSummarySection, SectionTitle, SectionItemTitle, SectionItemContent };

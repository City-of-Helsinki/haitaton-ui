import { Box } from '@chakra-ui/react';
import clsx from 'clsx';
import React from 'react';
import Text from '../../../common/components/text/Text';
import styles from './FormSummarySection.module.scss';

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
  return <Box color="var(--color-black-60)">{children}</Box>;
};

const FormSummarySection: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => {
  return (
    <section className={clsx(styles.container, className)} style={style}>
      {children}
    </section>
  );
};

export { FormSummarySection, SectionTitle, SectionItemTitle, SectionItemContent };

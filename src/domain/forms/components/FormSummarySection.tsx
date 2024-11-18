import { Box, BoxProps } from '@chakra-ui/react';
import clsx from 'clsx';
import React from 'react';
import Text from '../../../common/components/text/Text';
import styles from './FormSummarySection.module.scss';
import { useTranslation } from 'react-i18next';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box mb="var(--spacing-m)">
      <Text tag="h2" styleAs="h3" weight="bold">
        {children}
      </Text>
    </Box>
  );
};

const SectionItemTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box color="var(--color-black-90)">
      <Text tag="h3" styleAs="body-m" weight="bold">
        {children}
      </Text>
    </Box>
  );
};

interface SectionItemContentProps extends BoxProps {
  children?: React.ReactNode;
}
const SectionItemContent: React.FC<Readonly<SectionItemContentProps>> = ({
  children,
  ...chakraProps
}) => {
  return (
    <Box color="var(--color-black-70)" {...chakraProps}>
      {children}
    </Box>
  );
};

const SectionItemContentRemoved: React.FC<Readonly<SectionItemContentProps>> = ({
  children,
  ...chakraProps
}) => {
  const { t } = useTranslation();

  return (
    <SectionItemContent
      border="1px solid var(--color-error)"
      padding="var(--spacing-2-xs)"
      {...chakraProps}
    >
      <Box as="p" color="var(--color-error)" marginBottom="var(--spacing-s)" fontWeight={500}>
        {t('common:removed')}:
      </Box>
      {children}
    </SectionItemContent>
  );
};

const SectionItemContentAdded: React.FC<Readonly<SectionItemContentProps>> = ({
  children,
  ...chakraProps
}) => {
  const { t } = useTranslation();

  return (
    <SectionItemContent border="1px solid black" padding="var(--spacing-2-xs)" {...chakraProps}>
      <Box as="p" marginBottom="var(--spacing-s)" fontWeight={500}>
        {t('taydennys:labels:taydennys')}:
      </Box>
      {children}
    </SectionItemContent>
  );
};

const FormSummarySection: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  return (
    <section className={clsx(styles.container, className)} style={style}>
      {children}
    </section>
  );
};

export {
  FormSummarySection,
  SectionTitle,
  SectionItemTitle,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemContentAdded,
};

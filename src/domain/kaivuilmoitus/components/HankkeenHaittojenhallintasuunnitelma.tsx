import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { IconInfoCircleFill } from 'hds-react';

type Props = {
  text: string;
};

function Heading({ text }: Readonly<{ text: string }>) {
  return (
    <Flex>
      <IconInfoCircleFill />{' '}
      <Box as="span" paddingLeft="var(--spacing-xs)">
        {text}
      </Box>
    </Flex>
  );
}
export default function HankkeenHaittojenhallintasuunnitelma({ text }: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <CustomAccordion
      heading={<Heading text={t('hakemus:labels:hankeAreaNuisanceControl')} />}
      headingBorderBottom={false}
      headingBackgroundColor="var(--color-summer-light)"
      headingSize="s"
      border
    >
      <Box
        as="div"
        backgroundColor="var(--color-summer-light)"
        paddingLeft="var(--spacing-s)"
        paddingRight="var(--spacing-s)"
        paddingBottom="var(--spacing-s)"
      >
        {text}
      </Box>
    </CustomAccordion>
  );
}

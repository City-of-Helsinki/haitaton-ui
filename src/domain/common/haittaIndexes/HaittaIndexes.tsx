import { Flex, Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import HaittaIndex from './HaittaIndex';
import { HaittaIndexData } from './types';

function HaittaSection({
  heading,
  index,
  testId,
}: Readonly<{ heading: string; index?: number; testId?: string }>) {
  return (
    <Grid
      templateColumns="1fr 24px"
      gap="var(--spacing-xs)"
      padding="var(--spacing-s)"
      borderBottom="1px solid var(--color-black-30)"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: 'wrap', sm: 'nowrap' }}
      >
        <p className="heading-xs">
          <strong>{heading}</strong>
        </p>
        <HaittaIndex index={index} testId={testId} />
      </Flex>
    </Grid>
  );
}

type Props = {
  heading: string;
  haittaIndexData: HaittaIndexData | null | undefined;
  initiallyOpen?: boolean;
  className?: string;
};

export default function HaittaIndexes({
  heading,
  haittaIndexData,
  initiallyOpen = false,
  className,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <CustomAccordion
      heading={heading}
      headingBackgroundColor="var(--color-black-5)"
      initiallyOpen={initiallyOpen}
      className={className}
    >
      {haittaIndexData ? (
        <>
          <HaittaSection
            heading={t('hankeIndexes:pyoraliikenne')}
            index={haittaIndexData?.pyoraliikenneindeksi}
            testId="test-pyoraliikenneindeksi"
          />
          <HaittaSection
            heading={t('hankeIndexes:autoliikenne')}
            index={haittaIndexData?.autoliikenneindeksi}
            testId="test-autoliikenneindeksi"
          />
          <HaittaSection
            heading={t('hankeIndexes:linjaautoliikenne')}
            index={haittaIndexData?.linjaautoliikenneindeksi}
            testId="test-linjaautoliikenneindeksi"
          />
          <HaittaSection
            heading={t('hankeIndexes:raitioliikenne')}
            index={haittaIndexData?.raitioliikenneindeksi}
            testId="test-raitioliikenneindeksi"
          />
        </>
      ) : (
        <Flex
          height="300px"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px solid var(--color-black-30)"
        >
          <p>{t('common:haittaIndex:fillHaitat')}</p>
        </Flex>
      )}
    </CustomAccordion>
  );
}

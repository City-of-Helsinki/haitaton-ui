import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { HaittaIndexData } from './types';
import { HaittaSection } from './HaittaSection';

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
            index={haittaIndexData?.autoliikenne?.indeksi}
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

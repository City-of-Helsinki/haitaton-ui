import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { HaittaIndexData } from './types';
import { HaittaSection } from './HaittaSection';
import React from 'react';
import { HaittaSubSection } from './HaittaSubSection';
import HaittaIndex from './HaittaIndex';

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
          <CustomAccordion
            heading={t('hankeIndexes:autoliikenne')}
            headingElement={
              <HaittaIndex
                index={haittaIndexData?.autoliikenne?.indeksi}
                testId="test-autoliikenneindeksi"
              />
            }
            headingSize="s"
            strong
          >
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:katuluokka`)}
              index={haittaIndexData?.autoliikenne.katuluokka}
              testId="test-katuluokka"
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:liikennemaara`)}
              index={haittaIndexData?.autoliikenne.liikennemaara}
              testId="test-liikennemaara"
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistahaitta`)}
              index={haittaIndexData?.autoliikenne.kaistahaitta}
              testId="test-kaistahaitta"
            />
            <HaittaSubSection
              heading={t(
                `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistapituushaitta`,
              )}
              index={haittaIndexData?.autoliikenne.kaistapituushaitta}
              testId="test-kaistapituushaitta"
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:haitanKesto`)}
              index={haittaIndexData?.autoliikenne.haitanKesto}
              testId="test-haitanKesto"
            />
          </CustomAccordion>
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

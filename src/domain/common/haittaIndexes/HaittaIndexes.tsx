import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { HaittaIndexData } from './types';
import { HaittaSection } from './HaittaSection';
import { HaittaSubSection } from './HaittaSubSection';
import HaittaIndex from './HaittaIndex';
import HaittaTooltipContent from './HaittaTooltipContent';

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
            tooltipContent={
              <HaittaTooltipContent translationKey="hankeIndexes:tooltips:PYORALIIKENNE" />
            }
          />
          <CustomAccordion
            heading={t('hankeIndexes:autoliikenne')}
            headingElement={
              <HaittaIndex
                index={haittaIndexData?.autoliikenne?.indeksi}
                testId="test-autoliikenneindeksi"
                tooltipContent={
                  <HaittaTooltipContent
                    translationKey="hankeIndexes:tooltips:AUTOLIIKENNE"
                    showHeading={false}
                  />
                }
              />
            }
            headingSize="s"
            strong
          >
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:katuluokka`)}
              index={haittaIndexData?.autoliikenne.katuluokka}
              testId="test-katuluokka"
              tooltipContent={
                <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKatuluokka" />
              }
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:liikennemaara`)}
              index={haittaIndexData?.autoliikenne.liikennemaara}
              testId="test-liikennemaara"
              tooltipContent={
                <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoliikenneMaara" />
              }
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistahaitta`)}
              index={haittaIndexData?.autoliikenne.kaistahaitta}
              testId="test-kaistahaitta"
              tooltipContent={
                <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaHaitta" />
              }
            />
            <HaittaSubSection
              heading={t(
                `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistapituushaitta`,
              )}
              index={haittaIndexData?.autoliikenne.kaistapituushaitta}
              testId="test-kaistapituushaitta"
              tooltipContent={
                <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaPituusHaitta" />
              }
            />
            <HaittaSubSection
              heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:haitanKesto`)}
              index={haittaIndexData?.autoliikenne.haitanKesto}
              testId="test-haitanKesto"
              tooltipContent={
                <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoHankkeenKesto" />
              }
            />
          </CustomAccordion>
          <HaittaSection
            heading={t('hankeIndexes:linjaautoliikenne')}
            index={haittaIndexData?.linjaautoliikenneindeksi}
            testId="test-linjaautoliikenneindeksi"
            tooltipContent={
              <HaittaTooltipContent translationKey="hankeIndexes:tooltips:LINJAAUTOLIIKENNE" />
            }
          />
          <HaittaSection
            heading={t('hankeIndexes:raitioliikenne')}
            index={haittaIndexData?.raitioliikenneindeksi}
            testId="test-raitioliikenneindeksi"
            tooltipContent={
              <HaittaTooltipContent translationKey="hankeIndexes:tooltips:RAITIOLIIKENNE" />
            }
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

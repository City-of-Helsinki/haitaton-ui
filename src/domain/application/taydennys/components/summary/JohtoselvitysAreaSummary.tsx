import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { ApplicationArea, JohtoselvitysData } from '../../../types/application';
import { getAreaGeometries, getAreaGeometry } from '../../../../johtoselvitys/utils';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../../../map/utils';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemTitle,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import { formatToFinnishDate } from '../../../../../common/utils/date';
import Text from '../../../../../common/components/text/Text';
import { getAreaDefaultName } from '../../../utils';

function AreaInformation({
  area,
  areaName,
}: Readonly<{ area: ApplicationArea; areaName: string }>) {
  const { t } = useTranslation();
  const geom = getAreaGeometry(area);

  return (
    <Box marginBottom="var(--spacing-m)">
      <Text tag="p" spacingBottom="s">
        <strong>{areaName}</strong>
      </Text>
      <p>
        {t('form:labels:pintaAla')}: {formatSurfaceArea(geom)}
      </p>
    </Box>
  );
}

type Props = {
  data: JohtoselvitysData;
  originalData: JohtoselvitysData;
  muutokset: string[];
};

export default function JohtoselvitysAreaSummary({
  data,
  originalData,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { startTime, endTime, areas } = data;
  const startTimeChanged = muutokset.includes('startTime');
  const endTimeChanged = muutokset.includes('endTime');
  const areasChanged = areas.filter((_, index) => {
    const areaChanged = muutokset.includes(`areas[${index}]`);
    return areaChanged;
  });
  const areasRemoved = originalData.areas.filter(
    (_, index) => muutokset.includes(`areas[${index}]`) && !areas[index],
  );

  if (
    !startTimeChanged &&
    !endTimeChanged &&
    areasChanged.length === 0 &&
    areasRemoved.length === 0
  ) {
    return null;
  }

  const geometries: Geometry[] = getAreaGeometries(areasChanged);
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  return (
    <>
      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <FormSummarySection>
        {startTimeChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:startDate')}</SectionItemTitle>
            {!startTime ? (
              <SectionItemContentRemoved>
                <p>{formatToFinnishDate(originalData.startTime)}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>{<p>{formatToFinnishDate(startTime)}</p>}</SectionItemContent>
            )}
          </>
        )}
        {endTimeChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:endDate')}</SectionItemTitle>
            {!endTime ? (
              <SectionItemContentRemoved>
                <p>{formatToFinnishDate(originalData.endTime)}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>{<p>{formatToFinnishDate(endTime)}</p>}</SectionItemContent>
            )}
          </>
        )}
        {(areasChanged.length > 0 || areasRemoved.length > 0) && (
          <>
            {areasChanged.length > 0 && (
              <>
                <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
                <SectionItemContent>
                  <p>{totalSurfaceArea} m²</p>
                </SectionItemContent>
              </>
            )}
            <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
            <SectionItemContent>
              {areasChanged.map((area, index) => {
                return (
                  <AreaInformation
                    area={area}
                    areaName={getAreaDefaultName(t, index, originalData.areas.length)}
                    key={index}
                  />
                );
              })}
              {areasRemoved.length > 0 && (
                <SectionItemContentRemoved>
                  {areasRemoved.map((area, index) => {
                    return (
                      <AreaInformation
                        area={area}
                        areaName={getAreaDefaultName(
                          t,
                          originalData.areas.indexOf(area),
                          originalData.areas.length,
                        )}
                        key={index}
                      />
                    );
                  })}
                </SectionItemContentRemoved>
              )}
            </SectionItemContent>
          </>
        )}
      </FormSummarySection>
    </>
  );
}

import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import { JohtoselvitysData } from '../../../types/application';
import { getAreaGeometries } from '../../../../johtoselvitys/utils';
import { getTotalSurfaceArea } from '../../../../map/utils';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemTitle,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import { formatToFinnishDate } from '../../../../../common/utils/date';
import { getAreaDefaultName } from '../../../utils';
import AreaInformation from '../../../components/summary/AreaInformation';

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
  const { startTime, endTime, areas: taydennysAreas } = data;
  const startTimeChanged = muutokset.includes('startTime');
  const endTimeChanged = muutokset.includes('endTime');
  const areasChanged = taydennysAreas.filter((_, index) => {
    return muutokset.includes(`areas[${index}]`);
  });
  const areasRemoved = originalData.areas.filter(
    (_, index) => muutokset.includes(`areas[${index}]`) && !taydennysAreas[index],
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
              {taydennysAreas.map((area, index) => {
                if (!muutokset.includes(`areas[${index}]`)) {
                  return null;
                }
                return (
                  <AreaInformation
                    area={area}
                    areaName={getAreaDefaultName(t, index, originalData.areas.length)}
                    key={index}
                  />
                );
              })}
              {areasRemoved.length === originalData.areas.length && (
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

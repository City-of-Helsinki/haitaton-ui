import React from 'react';
import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { JohtoselvitysFormValues } from '../types';
import { getTotalSurfaceArea } from '../../map/utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { getAreaGeometries } from '../utils';
import { getAreaDefaultName } from '../../application/utils';
import AreaInformation from '../../application/components/summary/AreaInformation';

type Props = {
  formData: JohtoselvitysFormValues;
};

const AreaSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  const { startTime, endTime, areas } = formData.applicationData;

  const geometries: Geometry[] = getAreaGeometries(areas);
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hakemus:labels:startDate')}</SectionItemTitle>
      <SectionItemContent>
        {startTime && <p>{formatToFinnishDate(startTime)}</p>}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:endDate')}</SectionItemTitle>
      <SectionItemContent>{endTime && <p>{formatToFinnishDate(endTime)}</p>}</SectionItemContent>
      <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
      <SectionItemContent>
        <p>{totalSurfaceArea} m²</p>
      </SectionItemContent>
      <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
      <SectionItemContent>
        {areas.map((area, index) => {
          return (
            <AreaInformation
              area={area}
              areaName={getAreaDefaultName(t, index, areas.length)}
              key={index}
            />
          );
        })}
      </SectionItemContent>
    </FormSummarySection>
  );
};

export default AreaSummary;

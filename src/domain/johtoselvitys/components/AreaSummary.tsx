import React from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import GeometryCollection from 'ol/geom/GeometryCollection';
import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { JohtoselvitysFormValues } from '../types';
import Text from '../../../common/components/text/Text';
import { formatSurfaceArea } from '../../map/utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { getSurfaceArea } from '../../../common/components/map/utils';

function getTotalSurfaceArea(geometries: Geometry[]) {
  try {
    const totalSurfaceArea = geometries.reduce((totalArea, geom) => {
      return totalArea + Math.round(getSurfaceArea(geom));
    }, 0);
    return totalSurfaceArea;
  } catch (error) {
    return 0;
  }
}

type Props = {
  formData: JohtoselvitysFormValues;
};

const AreaSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  const { startTime, endTime, geometry } = formData.applicationData;

  const geometryCollection = new GeoJSON().readGeometry(geometry) as GeometryCollection;
  const geometries = geometryCollection.getGeometries();
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
      <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
      <SectionItemContent>
        {geometries.map((geom, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Box marginBottom="var(--spacing-m)" key={index}>
              <Text tag="p" spacingBottom="s">
                <strong>
                  {t('hakemus:labels:workArea')} {index > 0 && index + 1}
                </strong>
              </Text>
              <p>
                {t('form:labels:pintaAla')}: {formatSurfaceArea(geom)}
              </p>
            </Box>
          );
        })}
      </SectionItemContent>
    </FormSummarySection>
  );
};

export default AreaSummary;

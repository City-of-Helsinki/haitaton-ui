import React from 'react';
import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { JohtoselvitysFormValues } from '../../johtoselvitys/types';
import Text from '../../../common/components/text/Text';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../map/utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { getAreaGeometries, getAreaGeometry } from '../../johtoselvitys/utils';
import { getAreaDefaultName } from '../utils';

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
      <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
      <SectionItemContent>
        {areas.map((area, index) => {
          const geom = getAreaGeometry(area);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Box marginBottom="var(--spacing-m)" key={index}>
              <Text tag="p" spacingBottom="s">
                <strong>{getAreaDefaultName(t, index, areas.length)}</strong>
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

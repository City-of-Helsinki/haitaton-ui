import Geometry from 'ol/geom/Geometry';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { KaivuilmoitusFormValues } from '../types';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../map/utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { getAreaGeometry } from '../../johtoselvitys/utils';
import { getAreaDefaultName } from '../../application/utils';
import { KaivuilmoitusAlue } from '../../application/types/application';

function AreaDetail({ area }: Readonly<{ area: KaivuilmoitusAlue }>) {
  const { t } = useTranslation();
  const totalSurfaceArea = getTotalSurfaceArea(area.tyoalueet.map((alue) => getAreaGeometry(alue)));

  return (
    <Box marginBottom="var(--spacing-m)">
      <Box as="p" marginBottom="var(--spacing-xs)">
        <strong>
          {t('hakemus:labels:workAreaPlural')} ({area.name})
        </strong>
      </Box>
      <Box as="ul" marginBottom="var(--spacing-m)">
        {area.tyoalueet.map((tyoalue, index) => {
          const geom = getAreaGeometry(tyoalue);
          return (
            <Box as="li" key={index} listStyleType="none">
              {getAreaDefaultName(t, index, area.tyoalueet.length)} ({formatSurfaceArea(geom)})
            </Box>
          );
        })}
      </Box>
      <Box marginBottom="var(--spacing-m)">
        <p>
          {t('form:labels:pintaAla')}: {totalSurfaceArea} m²
        </p>
        <p>
          {t('form:yhteystiedot:labels:osoite')}: {area.katuosoite ? area.katuosoite : '-'}
        </p>
        <p>
          {t('hakemus:labels:tyonTarkoitus')}:{' '}
          {area.tyonTarkoitukset && area.tyonTarkoitukset.length > 0
            ? area.tyonTarkoitukset.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')
            : '-'}
        </p>
      </Box>
      <Box marginBottom="var(--spacing-m)">
        <p>
          {t('hankeForm:labels:meluHaitta')}:{' '}
          {area.meluhaitta ? t(`hanke:meluHaitta:${area.meluhaitta}`) : '-'}
        </p>
        <p>
          {t('hankeForm:labels:polyHaitta')}:{' '}
          {area.polyhaitta ? t(`hanke:polyHaitta:${area.polyhaitta}`) : '-'}
        </p>
        <p>
          {t('hankeForm:labels:tarinaHaitta')}:{' '}
          {area.tarinahaitta ? t(`hanke:tarinaHaitta:${area.tarinahaitta}`) : '-'}
        </p>
        <p>
          {t('hankeForm:labels:kaistaHaitta')}:{' '}
          {area.kaistahaitta ? t(`hanke:kaistaHaitta:${area.kaistahaitta}`) : '-'}
        </p>
        <p>
          {t('hankeForm:labels:kaistaPituusHaitta')}:{' '}
          {area.kaistahaittojenPituus
            ? t(`hanke:kaistaPituusHaitta:${area.kaistahaittojenPituus}`)
            : '-'}
        </p>
      </Box>
      <p>
        {t('hakemus:labels:areaAdditionalInfo')}: {area.lisatiedot ? area.lisatiedot : '-'}
      </p>
    </Box>
  );
}

type Props = {
  formData: KaivuilmoitusFormValues;
};

const AreaSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  const { startTime, endTime, areas } = formData.applicationData;

  const geometries: Geometry[] = areas
    .flatMap((area) => area.tyoalueet)
    .map((alue) => getAreaGeometry(alue));
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
      <SectionItemContent>
        <p>{totalSurfaceArea} m²</p>
      </SectionItemContent>
      <SectionItemTitle>{t('kaivuilmoitusForm:alueet:startDate')}</SectionItemTitle>
      <SectionItemContent>
        {startTime && <p>{formatToFinnishDate(startTime)}</p>}
      </SectionItemContent>
      <SectionItemTitle>{t('kaivuilmoitusForm:alueet:endDate')}</SectionItemTitle>
      <SectionItemContent>{endTime && <p>{formatToFinnishDate(endTime)}</p>}</SectionItemContent>

      <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
      <SectionItemContent>
        {areas.map((area) => (
          <AreaDetail key={area.hankealueId} area={area} />
        ))}
      </SectionItemContent>
    </FormSummarySection>
  );
};

export default AreaSummary;

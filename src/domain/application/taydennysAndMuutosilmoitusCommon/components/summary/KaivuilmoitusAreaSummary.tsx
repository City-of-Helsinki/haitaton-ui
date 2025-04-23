import { useTranslation } from 'react-i18next';
import { Geometry } from 'ol/geom';
import { Box } from '@chakra-ui/layout';
import { differenceBy } from 'lodash';
import { KaivuilmoitusAlue, KaivuilmoitusData } from '../../../types/application';
import { PartialExcept } from '../../../../../common/types/utils';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemTitle,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import { formatToFinnishDate } from '../../../../../common/utils/date';
import { getAreaGeometry } from '../../../../johtoselvitys/utils';
import { formatSurfaceArea, getTotalSurfaceArea } from '../../../../map/utils';
import { getAreaDefaultName } from '../../../utils';
import { isNewArea } from '../../utils';

function getKaivuilmoitusAlueChanges(
  kaivuilmoitusAlue: KaivuilmoitusAlue,
  muutokset: string[],
  index: number,
) {
  return {
    ...kaivuilmoitusAlue,
    katuosoite: muutokset.includes(`areas[${index}].katuosoite`)
      ? kaivuilmoitusAlue.katuosoite
      : undefined,
    tyonTarkoitukset: muutokset.includes(`areas[${index}].tyonTarkoitukset`)
      ? kaivuilmoitusAlue.tyonTarkoitukset
      : undefined,
    meluhaitta: muutokset.includes(`areas[${index}].meluhaitta`)
      ? kaivuilmoitusAlue.meluhaitta
      : undefined,
    polyhaitta: muutokset.includes(`areas[${index}].polyhaitta`)
      ? kaivuilmoitusAlue.polyhaitta
      : undefined,
    tarinahaitta: muutokset.includes(`areas[${index}].tarinahaitta`)
      ? kaivuilmoitusAlue.tarinahaitta
      : undefined,
    kaistahaitta: muutokset.includes(`areas[${index}].kaistahaitta`)
      ? kaivuilmoitusAlue.kaistahaitta
      : undefined,
    kaistahaittojenPituus: muutokset.includes(`areas[${index}].kaistahaittojenPituus`)
      ? kaivuilmoitusAlue.kaistahaittojenPituus
      : undefined,
    lisatiedot: muutokset.includes(`areas[${index}].lisatiedot`)
      ? kaivuilmoitusAlue.lisatiedot
      : undefined,
    // If there are changes to any work areas, include all work areas
    tyoalueet:
      kaivuilmoitusAlue.tyoalueet.filter((_, tyoalueIndex) => {
        return muutokset.includes(`areas[${index}].tyoalueet[${tyoalueIndex}]`);
      }).length > 0
        ? kaivuilmoitusAlue.tyoalueet
        : [],
  };
}

function AreaDetail({ area }: Readonly<{ area: PartialExcept<KaivuilmoitusAlue, 'tyoalueet'> }>) {
  const { t } = useTranslation();

  const totalSurfaceArea = getTotalSurfaceArea(area.tyoalueet.map((alue) => getAreaGeometry(alue)));

  return (
    <Box marginBottom="var(--spacing-m)">
      <Box as="p" marginBottom="var(--spacing-xs)">
        <strong>
          {t('hakemus:labels:workAreaPlural')} ({area.name})
        </strong>
      </Box>
      {area.tyoalueet.length > 0 && (
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
      )}
      <Box marginBottom="var(--spacing-m)">
        {totalSurfaceArea > 0 ? (
          <p>
            {t('form:labels:pintaAla')}: {totalSurfaceArea} m²
          </p>
        ) : null}
        {area.katuosoite && (
          <p>
            {t('form:yhteystiedot:labels:osoite')}: {area.katuosoite}
          </p>
        )}
        {area.tyonTarkoitukset && area.tyonTarkoitukset.length > 0 ? (
          <p>
            {t('hakemus:labels:tyonTarkoitus')}:{' '}
            {area.tyonTarkoitukset.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
          </p>
        ) : null}
      </Box>
      <Box marginBottom="var(--spacing-m)">
        {area.meluhaitta && (
          <p>
            {t('hankeForm:labels:meluHaitta')}: {t(`hanke:meluHaitta:${area.meluhaitta}`)}
          </p>
        )}
        {area.polyhaitta && (
          <p>
            {t('hankeForm:labels:polyHaitta')}: {t(`hanke:polyHaitta:${area.polyhaitta}`)}
          </p>
        )}
        {area.tarinahaitta && (
          <p>
            {t('hankeForm:labels:tarinaHaitta')}: {t(`hanke:tarinaHaitta:${area.tarinahaitta}`)}
          </p>
        )}
        {area.kaistahaitta && (
          <p>
            {t('hankeForm:labels:kaistaHaitta')}: {t(`hanke:kaistaHaitta:${area.kaistahaitta}`)}
          </p>
        )}
        {area.kaistahaittojenPituus && (
          <p>
            {t('hankeForm:labels:kaistaPituusHaitta')}:{' '}
            {t(`hanke:kaistaPituusHaitta:${area.kaistahaittojenPituus}`)}
          </p>
        )}
      </Box>
      {area.lisatiedot && (
        <p>
          {t('hakemus:labels:areaAdditionalInfo')}: {area.lisatiedot}
        </p>
      )}
    </Box>
  );
}

type Props = {
  data: KaivuilmoitusData;
  originalData: KaivuilmoitusData;
  muutokset: string[];
};

export default function KaivuilmoitusAreaSummary({
  data,
  originalData,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { startTime, endTime, areas: taydennysAreas } = data;
  const startTimeChanged = muutokset.includes('startTime');
  const endTimeChanged = muutokset.includes('endTime');
  const changedAreas: PartialExcept<KaivuilmoitusAlue, 'tyoalueet'>[] = taydennysAreas
    .map((kaivuilmoitusAlue, index) => {
      if (isNewArea(index, muutokset)) {
        return kaivuilmoitusAlue;
      } else {
        return getKaivuilmoitusAlueChanges(kaivuilmoitusAlue, muutokset, index);
      }
    })
    .filter((_, index) => {
      return muutokset.includes(`areas[${index}]`);
    });
  const removedAreas = differenceBy(originalData.areas, taydennysAreas, 'hankealueId');
  if (
    changedAreas.length === 0 &&
    removedAreas.length === 0 &&
    !startTimeChanged &&
    !endTimeChanged
  ) {
    return null;
  }

  const geometries: Geometry[] = taydennysAreas
    .flatMap((area) => area.tyoalueet)
    .map((alue) => getAreaGeometry(alue));
  const totalSurfaceArea = getTotalSurfaceArea(geometries);

  return (
    <>
      <SectionTitle>{t('form:labels:areas')}</SectionTitle>
      <FormSummarySection>
        {totalSurfaceArea > 0 && (
          <>
            <SectionItemTitle>{t('form:labels:kokonaisAla')}</SectionItemTitle>
            <SectionItemContent>
              <p>{totalSurfaceArea} m²</p>
            </SectionItemContent>
          </>
        )}
        {startTimeChanged && (
          <>
            <SectionItemTitle>{t('kaivuilmoitusForm:alueet:startDate')}</SectionItemTitle>
            <SectionItemContent>
              {startTime && <p>{formatToFinnishDate(startTime)}</p>}
            </SectionItemContent>
          </>
        )}
        {endTimeChanged && (
          <>
            <SectionItemTitle>{t('kaivuilmoitusForm:alueet:endDate')}</SectionItemTitle>
            <SectionItemContent>
              {endTime && <p>{formatToFinnishDate(endTime)}</p>}
            </SectionItemContent>
          </>
        )}
        {(changedAreas.length > 0 || removedAreas.length > 0) && (
          <>
            <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
            <SectionItemContent>
              {changedAreas.map((area) => (
                <AreaDetail key={area.hankealueId} area={area} />
              ))}
              {removedAreas.length > 0 && (
                <SectionItemContentRemoved>
                  {removedAreas.map((area) => (
                    <AreaDetail key={area.hankealueId} area={area} />
                  ))}
                </SectionItemContentRemoved>
              )}
            </SectionItemContent>
          </>
        )}
      </FormSummarySection>
    </>
  );
}

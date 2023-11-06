import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatToFinnishDate } from '../../../../common/utils/date';
import { formatSurfaceArea } from '../../../map/utils';
import { FORMFIELD, HankeAlueFormState } from '../types';

const AreaSummary: React.FC<{ area: HankeAlueFormState; index: number }> = ({ area, index }) => {
  const { t } = useTranslation();

  const areaGeometry = area?.feature?.getGeometry();
  const surfaceArea = areaGeometry && formatSurfaceArea(areaGeometry);

  return (
    <div style={{ marginBottom: 'var(--spacing-m)' }}>
      <p style={{ marginBottom: 'var(--spacing-s)' }}>
        <strong>{area.nimi || t('hanke:alue:title', { index: index + 1 })}</strong>
      </p>
      <p>
        {t('form:labels:pintaAla')}: {surfaceArea}
      </p>
      <p>
        Ajanjakso: {formatToFinnishDate(area.haittaAlkuPvm)}–
        {formatToFinnishDate(area.haittaLoppuPvm)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.MELUHAITTA}:${area.meluHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.POLYHAITTA}:${area.polyHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.TARINAHAITTA}:${area.tarinaHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.KAISTAHAITTA}:${area.kaistaHaitta}`)}
      </p>
      <p>
        {t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}:{' '}
        {t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${area.kaistaPituusHaitta}`)}
      </p>
    </div>
  );
};

export default AreaSummary;

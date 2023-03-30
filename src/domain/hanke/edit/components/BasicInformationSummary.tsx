import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatToFinnishDate } from '../../../../common/utils/date';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { HankeDataDraft } from '../../../types/hanke';
import { FORMFIELD, HankeDataFormState } from '../types';
import { getAreasMaxEndDate, getAreasMinStartDate } from '../utils';

type Props = {
  formData: HankeDataFormState | HankeDataDraft;
};

const BasicInformationSummary: React.FC<Props> = ({ formData, children }) => {
  const { t } = useTranslation();

  const hankeAreas = formData[FORMFIELD.HANKEALUEET];
  const minAreaStartDate = getAreasMinStartDate(hankeAreas);
  const maxAreaEndDate = getAreasMaxEndDate(hankeAreas);
  let startDate;
  let endDate;
  try {
    startDate = minAreaStartDate && formatToFinnishDate(minAreaStartDate.toISOString());
    endDate = maxAreaEndDate && formatToFinnishDate(maxAreaEndDate.toISOString());
    // eslint-disable-next-line no-empty
  } catch (error) {}

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hankeForm:labels:perustaja')}</SectionItemTitle>
      <SectionItemContent />
      <SectionItemTitle>{t('hankeForm:labels:nimi')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.nimi}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:hankeTunnus')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.hankeTunnus}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:kuvaus')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.kuvaus}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:tyomaaKatuosoite')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.tyomaaKatuosoite}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:alkuPvm')}</SectionItemTitle>
      <SectionItemContent>
        <p>{startDate}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:loppuPvm')}</SectionItemTitle>
      <SectionItemContent>
        <p>{endDate}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:vaihe')}</SectionItemTitle>
      <SectionItemContent>
        {formData.vaihe !== null && <p>{t(`hanke:vaihe:${formData.vaihe}`)}</p>}
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:tyomaaTyyppi')}</SectionItemTitle>
      <SectionItemContent>
        <p>
          {formData.tyomaaTyyppi?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
        </p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:tyomaaKoko')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.tyomaaKoko && <>{t(`hanke:tyomaaKoko:${formData.tyomaaKoko}`)}</>}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hankeForm:labels:onYKTHanke')}</SectionItemTitle>
      <SectionItemContent>
        <p>{formData.onYKTHanke ? t('common:yes') : t('common:no')}</p>
      </SectionItemContent>
      {children}
    </FormSummarySection>
  );
};

export default BasicInformationSummary;

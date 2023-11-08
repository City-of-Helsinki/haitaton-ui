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

const SectionData: React.FC<{ title: string; content: string | undefined }> = ({
  title,
  content,
}) => {
  return (
    <>
      <SectionItemTitle>{title}</SectionItemTitle>
      <SectionItemContent>
        <p>{content}</p>
      </SectionItemContent>
    </>
  );
};

type Props = {
  formData: HankeDataFormState | HankeDataDraft;
  children?: React.ReactNode;
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
      <SectionData title={t('hankeForm:labels:nimi')} content={formData.nimi} />
      <SectionData title={t('hankeForm:labels:hankeTunnus')} content={formData.hankeTunnus} />
      {formData.kuvaus && (
        <SectionData title={t('hankeForm:labels:kuvaus')} content={formData.kuvaus} />
      )}
      {formData.tyomaaKatuosoite && (
        <SectionData
          title={t('hankeForm:labels:tyomaaKatuosoite')}
          content={formData.tyomaaKatuosoite}
        />
      )}
      {formData.alkuPvm && (
        <SectionData title={t('hankeForm:labels:alkuPvm')} content={startDate} />
      )}
      {formData.loppuPvm && (
        <SectionData title={t('hankeForm:labels:loppuPvm')} content={endDate} />
      )}
      {formData.vaihe && (
        <SectionData
          title={t('hankeForm:labels:vaihe')}
          content={t(`hanke:vaihe:${formData.vaihe}`)}
        />
      )}
      {formData.tyomaaTyyppi && formData.tyomaaTyyppi.length > 0 && (
        <SectionData
          title={t('hankeForm:labels:tyomaaTyyppi')}
          content={formData.tyomaaTyyppi
            ?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`))
            .join(', ')}
        />
      )}
      <SectionData
        title={t('hankeForm:labels:onYKTHanke')}
        content={formData.onYKTHanke ? t('common:yes') : t('common:no')}
      />
      {children}
    </FormSummarySection>
  );
};

export default BasicInformationSummary;

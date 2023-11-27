import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatToFinnishDate } from '../../../../common/utils/date';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { HankeDataDraft } from '../../../types/hanke';
import { HankeDataFormState } from '../types';

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
        <SectionData
          title={t('hankeForm:labels:alkuPvm')}
          content={formatToFinnishDate(formData.alkuPvm)}
        />
      )}
      {formData.loppuPvm && (
        <SectionData
          title={t('hankeForm:labels:loppuPvm')}
          content={formatToFinnishDate(formData.loppuPvm)}
        />
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

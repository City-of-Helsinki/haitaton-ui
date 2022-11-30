import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { formatToFinnishDate } from '../../../common/utils/date';
import {
  FormSummarySection,
  SectionTitle,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { HankeDataFormState } from './types';

type Props = {
  formData: HankeDataFormState;
};

const HankeFormSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  return (
    <article>
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenYhteenvetoForm:instructions')}</p>
      </Box>

      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>{t('hankeForm:labels:nimi')}</SectionItemTitle>
        <SectionItemContent>{formData.nimi}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:hankeTunnus')}</SectionItemTitle>
        <SectionItemContent>{formData.hankeTunnus}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:kuvaus')}</SectionItemTitle>
        <SectionItemContent>{formData.kuvaus}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKatuosoite')}</SectionItemTitle>
        <SectionItemContent>{formData.tyomaaKatuosoite}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:alkuPvm')}</SectionItemTitle>
        <SectionItemContent>
          {formData.alkuPvm && formatToFinnishDate(formData.alkuPvm)}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:loppuPvm')}</SectionItemTitle>
        <SectionItemContent>
          {formData.loppuPvm && formatToFinnishDate(formData.loppuPvm)}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:vaihe')}</SectionItemTitle>
        <SectionItemContent>{t(`hanke:vaihe:${formData.vaihe}`)}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaTyyppi')}</SectionItemTitle>
        <SectionItemContent>
          {formData.tyomaaTyyppi?.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:tyomaaKoko')}</SectionItemTitle>
        <SectionItemContent>{t(`hanke:tyomaaKoko:${formData.tyomaaKoko}`)}</SectionItemContent>
        <SectionItemTitle>{t('hankeForm:labels:onYKTHanke')}</SectionItemTitle>
        <SectionItemContent>
          {formData.onYKTHanke ? t('common:yes') : t('common:no')}
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Alueiden kokonaispinta-ala</SectionItemTitle>
        <SectionItemContent />
        <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
        <SectionItemContent />
      </FormSummarySection>

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Perustaja</SectionItemTitle>
        <SectionItemContent />
        <SectionItemTitle>Hankkeen omistaja</SectionItemTitle>
        <SectionItemContent />
        <SectionItemTitle>Rakennuttajat</SectionItemTitle>
        <SectionItemContent />
      </FormSummarySection>

      <SectionTitle>Liitteet</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>Lisätyt liitetiedostot</SectionItemTitle>
        <SectionItemContent />
      </FormSummarySection>
    </article>
  );
};

export default HankeFormSummary;

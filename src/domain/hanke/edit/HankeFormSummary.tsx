import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionTitle,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { HankeDataFormState } from './types';
import BasicInformationSummary from './components/BasicInformationSummary';
import ContactsSummary from './components/ContactsSummary';
import AreaSummary from './components/AreaSummary';
import { calculateTotalSurfaceArea } from './utils';
import AttachmentSummary from './components/AttachmentSummary';
import useHankeAttachments from '../hankeAttachments/useHankeAttachments';
import AlertBulletin from './components/AlertBulletin';
import HaittojenhallintaSummary from './components/HaittojenhallintaSummary';

type Props = {
  formData: HankeDataFormState;
};

const HankeFormSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();
  const areasTotalSurfaceArea = calculateTotalSurfaceArea(formData.alueet);
  const { data: attachments } = useHankeAttachments(formData.hankeTunnus);

  const contactAmount: number = [
    formData.omistajat.length,
    formData.rakennuttajat.length,
    formData.toteuttajat.length,
    formData.muut.length,
  ].reduce((acc, current) => acc + current, 0);

  return (
    <article>
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenYhteenvetoForm:instructions')}</p>
      </Box>

      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <BasicInformationSummary formData={formData} />

      <SectionTitle>{t('form:labels:areas')}</SectionTitle>
      {formData.alueet !== undefined && formData.alueet?.length > 0 ? (
        <FormSummarySection>
          <SectionItemTitle>{t('hanke:alue:totalSurfaceArea')}</SectionItemTitle>
          <SectionItemContent>
            {areasTotalSurfaceArea && <p>{areasTotalSurfaceArea} m²</p>}
          </SectionItemContent>
          <SectionItemTitle>{t('form:labels:areas')}</SectionItemTitle>
          <SectionItemContent>
            {formData.alueet?.map((alue, index) => (
              <AreaSummary key={index} area={alue} index={index} />
            ))}
          </SectionItemContent>
        </FormSummarySection>
      ) : (
        <AlertBulletin info={t('hankeForm:hankkeenYhteenvetoForm:dataNotFound')} />
      )}

      <SectionTitle>{t('form:headers:haittojenHallinta')}</SectionTitle>
      {formData.alueet !== undefined && formData.alueet?.length > 0 ? (
        <Box mb="var(--spacing-l)">
          <HaittojenhallintaSummary hankealueet={formData.alueet} />
        </Box>
      ) : (
        <AlertBulletin info={t('hankeForm:hankkeenYhteenvetoForm:dataNotFound')} />
      )}

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      {contactAmount > 0 ? (
        <FormSummarySection>
          {formData.omistajat.length > 0 && (
            <ContactsSummary
              contacts={formData.omistajat}
              title={t('form:yhteystiedot:titles:omistajatPlural')}
            />
          )}
          {formData.rakennuttajat?.length > 0 && (
            <ContactsSummary
              contacts={formData.rakennuttajat}
              title={t('form:yhteystiedot:titles:rakennuttajatPlural')}
            />
          )}
          {formData.toteuttajat?.length > 0 && (
            <ContactsSummary
              contacts={formData.toteuttajat}
              title={t('form:yhteystiedot:titles:toteuttajatPlural')}
            />
          )}
          {formData.muut?.length > 0 && (
            <ContactsSummary
              contacts={formData.muut}
              title={t('form:yhteystiedot:titles:muutPlural')}
            />
          )}
        </FormSummarySection>
      ) : (
        <AlertBulletin info={t('hankeForm:hankkeenYhteenvetoForm:dataNotFound')} />
      )}

      <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
      {formData.hankeTunnus !== undefined && attachments !== undefined && attachments.length > 0 ? (
        <AttachmentSummary hankeTunnus={formData.hankeTunnus} attachments={attachments} />
      ) : (
        <AlertBulletin info={t('hankeForm:hankkeenYhteenvetoForm:attachmentsNotFound')} />
      )}
    </article>
  );
};

export default HankeFormSummary;

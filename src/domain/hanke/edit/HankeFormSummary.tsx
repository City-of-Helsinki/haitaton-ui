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

type Props = {
  formData: HankeDataFormState;
};

const HankeFormSummary: React.FC<Props> = ({ formData }) => {
  const { t } = useTranslation();

  const areasTotalSurfaceArea = calculateTotalSurfaceArea(formData.alueet);

  return (
    <article>
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenYhteenvetoForm:instructions')}</p>
      </Box>

      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <BasicInformationSummary formData={formData} />

      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <FormSummarySection>
        <SectionItemTitle>{t('hanke:alue:totalSurfaceArea')}</SectionItemTitle>
        <SectionItemContent>
          {areasTotalSurfaceArea && <p>{areasTotalSurfaceArea} m²</p>}
        </SectionItemContent>
        <SectionItemTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionItemTitle>
        <SectionItemContent>
          {formData.alueet?.map((alue, index) => (
            <AreaSummary key={index} area={alue} index={index} />
          ))}
        </SectionItemContent>
      </FormSummarySection>

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        {formData.omistajat && formData.omistajat.length > 0 && (
          <ContactsSummary
            contacts={formData.omistajat}
            title={t('form:yhteystiedot:titles:omistaja')}
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
    </article>
  );
};

export default HankeFormSummary;

import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { FormSummarySection, SectionTitle } from '../forms/components/FormSummarySection';
import BasicInformationSummary from '../application/components/summary/JohtoselvitysBasicInformationSummary';
import AreaSummary from '../johtoselvitys/components/AreaSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import { Application, JohtoselvitysData } from '../application/types/application';
import { Box } from '@chakra-ui/react';

type Props = {
  originalApplication: Application<JohtoselvitysData>;
};

export default function ReviewAndSend({ originalApplication }: Readonly<Props>) {
  const { t } = useTranslation();
  const {
    applicationData: {
      customerWithContacts,
      contractorWithContacts,
      propertyDeveloperWithContacts,
      representativeWithContacts,
    },
  } = originalApplication;

  return (
    <Tabs>
      <TabList>
        <Tab>{t('taydennys:labels:originalInformation')}</Tab>
      </TabList>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
          <BasicInformationSummary formData={originalApplication} />

          <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
          <AreaSummary formData={originalApplication} />

          <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
          <FormSummarySection>
            <ContactsSummary
              customerWithContacts={customerWithContacts}
              title={t('form:yhteystiedot:titles:customerWithContacts')}
            />
            <ContactsSummary
              customerWithContacts={contractorWithContacts}
              title={t('form:yhteystiedot:titles:contractorWithContacts')}
            />
            <ContactsSummary
              customerWithContacts={propertyDeveloperWithContacts}
              title={t('form:yhteystiedot:titles:rakennuttajat')}
            />
            <ContactsSummary
              customerWithContacts={representativeWithContacts}
              title={t('form:yhteystiedot:titles:representativeWithContacts')}
            />
          </FormSummarySection>
        </Box>
      </TabPanel>
    </Tabs>
  );
}

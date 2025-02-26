import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Box } from '@chakra-ui/layout';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../application/types/application';
import { FormSummarySection, SectionTitle } from '../forms/components/FormSummarySection';
import BasicInformationSummary from '../application/components/summary/KaivuilmoitusBasicInformationSummary';
import AreaSummary from '../kaivuilmoitus/components/AreaSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import InvoicingCustomerSummary from '../application/components/summary/InvoicingCustomerSummary';
import AttachmentSummary from '../application/components/summary/KaivuilmoitusAttachmentSummary';
import HaittojenhallintaSummary from '../kaivuilmoitus/components/HaittojenhallintaSummary';
import { HankeAlue } from '../types/hanke';

type Props = {
  originalApplication: Application<KaivuilmoitusData>;
  originalAttachments: ApplicationAttachmentMetadata[];
  hankealueet: HankeAlue[];
};

export default function ReviewAndSend({
  originalApplication,
  originalAttachments,
  hankealueet,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabList>
        <Tab>{t('muutosilmoitus:labels:originalInformation')}</Tab>
      </TabList>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <SectionTitle>{t('form:headers:perustiedot')}</SectionTitle>
          <BasicInformationSummary formData={originalApplication} />

          <SectionTitle>{t('form:labels:areas')}</SectionTitle>
          <AreaSummary formData={originalApplication} />

          <SectionTitle>{t('hankePortfolio:tabit:haittojenHallinta')}</SectionTitle>
          <HaittojenhallintaSummary hankealueet={hankealueet} formData={originalApplication} />

          <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
          <FormSummarySection>
            <ContactsSummary
              customerWithContacts={originalApplication.applicationData.customerWithContacts}
              title={t('form:yhteystiedot:titles:customerWithContacts')}
            />
            <ContactsSummary
              customerWithContacts={originalApplication.applicationData.contractorWithContacts}
              title={t('form:yhteystiedot:titles:contractorWithContacts')}
            />
            <ContactsSummary
              customerWithContacts={
                originalApplication.applicationData.propertyDeveloperWithContacts
              }
              title={t('form:yhteystiedot:titles:rakennuttajat')}
            />
            <ContactsSummary
              customerWithContacts={originalApplication.applicationData.representativeWithContacts}
              title={t('form:yhteystiedot:titles:representativeWithContacts')}
            />
            <InvoicingCustomerSummary
              invoicingCustomer={originalApplication.applicationData.invoicingCustomer}
            />
          </FormSummarySection>

          <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
          <AttachmentSummary formData={originalApplication} attachments={originalAttachments} />
        </Box>
      </TabPanel>
    </Tabs>
  );
}

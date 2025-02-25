import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Box } from '@chakra-ui/layout';
import { Taydennys } from '../application/taydennys/types';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../application/types/application';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
  SectionTitle,
} from '../forms/components/FormSummarySection';
import BasicInformationSummary from '../application/components/summary/KaivuilmoitusBasicInformationSummary';
import AreaSummary from '../kaivuilmoitus/components/AreaSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import InvoicingCustomerSummary from '../application/components/summary/InvoicingCustomerSummary';
import AttachmentSummary from '../application/components/summary/KaivuilmoitusAttachmentSummary';
import HaittojenhallintaSummary from '../kaivuilmoitus/components/HaittojenhallintaSummary';
import { HankeAlue } from '../types/hanke';
import TaydennysBasicInformationSummary from '../application/taydennys/components/summary/KaivuilmoitusBasicInformationSummary';
import TaydennysAreasSummary from '../application/taydennys/components/summary/KaivuilmoitusAreaSummary';
import TaydennysHaittojenhallintaSummary from '../application/taydennys/components/summary/KaivuilmoitusHaittojenhallintaSummary';
import TaydennysContactsSummary from '../application/taydennys/components/summary/ContactsSummary';
import TaydennysAttachmentsList from '../application/taydennys/components/TaydennysAttachmentsList';

type Props = {
  taydennys: Taydennys<KaivuilmoitusData>;
  muutokset: string[];
  originalApplication: Application<KaivuilmoitusData>;
  originalAttachments: ApplicationAttachmentMetadata[];
  hankealueet: HankeAlue[];
};

export default function ReviewAndSend({
  taydennys,
  muutokset,
  originalApplication,
  originalAttachments,
  hankealueet,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const trafficArrangementPlans = taydennys.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const mandates = taydennys.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'VALTAKIRJA',
  );
  const otherAttachments = taydennys.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'MUU',
  );

  return (
    <Tabs>
      <TabList>
        <Tab>{t('taydennys:labels:taydennykset')}</Tab>
        <Tab>{t('taydennys:labels:originalInformation')}</Tab>
      </TabList>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <TaydennysBasicInformationSummary
            data={taydennys.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutokset}
          />
          <TaydennysAreasSummary
            data={taydennys.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutokset}
          />
          <TaydennysHaittojenhallintaSummary
            hankealueet={hankealueet}
            kaivuilmoitusAlueet={taydennys.applicationData.areas}
            muutokset={muutokset}
          />
          <TaydennysContactsSummary
            data={taydennys.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutokset}
          />
          {taydennys.liitteet?.length > 0 && (
            <>
              <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
              <FormSummarySection>
                {trafficArrangementPlans.length > 0 && (
                  <>
                    <SectionItemTitle>
                      {t('taydennys:labels:addedTrafficArrangementPlan')}
                    </SectionItemTitle>
                    <SectionItemContent>
                      <TaydennysAttachmentsList attachments={trafficArrangementPlans} />
                    </SectionItemContent>
                  </>
                )}
                {mandates.length > 0 && (
                  <>
                    <SectionItemTitle>{t('taydennys:labels:addedMandate')}</SectionItemTitle>
                    <SectionItemContent>
                      <TaydennysAttachmentsList attachments={mandates} allowDownload={false} />
                    </SectionItemContent>
                  </>
                )}
                {otherAttachments.length > 0 && (
                  <>
                    <SectionItemTitle>
                      {t('taydennys:labels:addedOtherAttachments')}
                    </SectionItemTitle>
                    <SectionItemContent>
                      <TaydennysAttachmentsList attachments={otherAttachments} />
                    </SectionItemContent>
                  </>
                )}
              </FormSummarySection>
            </>
          )}
        </Box>
      </TabPanel>
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

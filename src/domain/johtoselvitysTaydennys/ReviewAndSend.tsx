import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
  SectionTitle,
} from '../forms/components/FormSummarySection';
import BasicInformationSummary from '../application/components/summary/JohtoselvitysBasicInformationSummary';
import AreaSummary from '../johtoselvitys/components/AreaSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import {
  Application,
  ApplicationAttachmentMetadata,
  JohtoselvitysData,
} from '../application/types/application';
import { Box } from '@chakra-ui/react';
import { Taydennys } from '../application/taydennys/types';
import TaydennysBasicInformationSummary from '../application/taydennys/components/summary/JohtoselvitysBasicInformationSummary';
import TaydennysAreaSummary from '../application/taydennys/components/summary/JohtoselvitysAreaSummary';
import TaydennysContactsSummary from '../application/taydennys/components/summary/JohtoselvitysContactsSummary';
import AttachmentSummary from '../application/components/summary/AttachmentSummary';
import TaydennysAttachmentsList from '../application/taydennys/components/TaydennysAttachmentsList';

type Props = {
  taydennys: Taydennys<JohtoselvitysData>;
  muutokset: string[];
  originalApplication: Application<JohtoselvitysData>;
  originalAttachments: ApplicationAttachmentMetadata[];
};

export default function ReviewAndSend({
  taydennys,
  muutokset,
  originalApplication,
  originalAttachments,
}: Readonly<Props>) {
  const { t } = useTranslation();

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
          <TaydennysAreaSummary
            data={taydennys.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutokset}
          />
          <TaydennysContactsSummary
            data={taydennys.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutokset}
          />
          {taydennys.liitteet?.length > 0 && (
            <>
              <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
              <FormSummarySection>
                <SectionItemTitle>{t('taydennys:labels:addedAttachments')}</SectionItemTitle>
                <SectionItemContent>
                  <TaydennysAttachmentsList attachments={taydennys.liitteet} />
                </SectionItemContent>
              </FormSummarySection>
            </>
          )}
        </Box>
      </TabPanel>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
          <BasicInformationSummary formData={originalApplication} />

          <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
          <AreaSummary formData={originalApplication} />

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
          </FormSummarySection>
          <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
          {originalAttachments && originalAttachments.length > 0 ? (
            <AttachmentSummary attachments={originalAttachments} />
          ) : null}
        </Box>
      </TabPanel>
    </Tabs>
  );
}

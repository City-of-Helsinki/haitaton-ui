import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Box } from '@chakra-ui/layout';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../application/types/application';
import { HankeAlue } from '../types/hanke';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';
import KaivuilmoitusSummary from '../kaivuilmoitus/components/KaivuilmoitusSummary';
import BasicInformationSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusBasicInformationSummary';
import AreaSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusAreaSummary';
import HaittojenhallintaSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusHaittojenhallintaSummary';
import ContactsSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/ContactsSummary';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
  SectionTitle,
} from '../forms/components/FormSummarySection';
import MuutosilmoitusAttachmentsList from '../application/muutosilmoitus/components/MuutosilmoitusAttachmentsList';
import React from 'react';

type Props = {
  muutosilmoitus: Muutosilmoitus<KaivuilmoitusData>;
  originalApplication: Application<KaivuilmoitusData>;
  originalAttachments: ApplicationAttachmentMetadata[];
  hankealueet: HankeAlue[];
};

export default function ReviewAndSend({
  muutosilmoitus,
  originalApplication,
  originalAttachments,
  hankealueet,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const trafficArrangementPlans = muutosilmoitus.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const mandates = muutosilmoitus.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'VALTAKIRJA',
  );
  const otherAttachments = muutosilmoitus.liitteet?.filter(
    (attachment) => attachment.attachmentType === 'MUU',
  );

  return (
    <Tabs>
      <TabList>
        <Tab>{t('muutosilmoitus:labels:muutokset')}</Tab>
        <Tab>{t('muutosilmoitus:labels:originalInformation')}</Tab>
      </TabList>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <BasicInformationSummary
            data={muutosilmoitus.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutosilmoitus.muutokset}
          />
          <AreaSummary
            data={muutosilmoitus.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutosilmoitus.muutokset}
          />
          <HaittojenhallintaSummary
            hankealueet={hankealueet}
            kaivuilmoitusAlueet={muutosilmoitus.applicationData.areas}
            muutokset={muutosilmoitus.muutokset}
          />
          <ContactsSummary
            data={muutosilmoitus.applicationData}
            originalData={originalApplication.applicationData}
            muutokset={muutosilmoitus.muutokset}
          />
          {muutosilmoitus.liitteet?.length > 0 && (
            <>
              <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
              <FormSummarySection>
                {trafficArrangementPlans.length > 0 && (
                  <>
                    <SectionItemTitle>
                      {t('taydennys:labels:addedTrafficArrangementPlan')}
                    </SectionItemTitle>
                    <SectionItemContent>
                      <MuutosilmoitusAttachmentsList attachments={trafficArrangementPlans} />
                    </SectionItemContent>
                  </>
                )}
                {mandates.length > 0 && (
                  <>
                    <SectionItemTitle>{t('taydennys:labels:addedMandate')}</SectionItemTitle>
                    <SectionItemContent>
                      <MuutosilmoitusAttachmentsList attachments={mandates} allowDownload={false} />
                    </SectionItemContent>
                  </>
                )}
                {otherAttachments.length > 0 && (
                  <>
                    <SectionItemTitle>
                      {t('taydennys:labels:addedOtherAttachments')}
                    </SectionItemTitle>
                    <SectionItemContent>
                      <MuutosilmoitusAttachmentsList attachments={otherAttachments} />
                    </SectionItemContent>
                  </>
                )}
              </FormSummarySection>
            </>
          )}
          {muutosilmoitus.muutokset.includes('additionalInfo') && (
            <FormSummarySection>
              <SectionItemTitle>
                {t('kaivuilmoitusForm:liitteetJaLisatiedot:additionalInformation')}
              </SectionItemTitle>
              <SectionItemContent>
                <p>{muutosilmoitus.applicationData.additionalInfo}</p>
              </SectionItemContent>
            </FormSummarySection>
          )}
        </Box>
      </TabPanel>
      <TabPanel>
        <Box mt="var(--spacing-s)">
          <KaivuilmoitusSummary
            application={originalApplication}
            attachments={originalAttachments}
            hankealueet={hankealueet}
          />
        </Box>
      </TabPanel>
    </Tabs>
  );
}

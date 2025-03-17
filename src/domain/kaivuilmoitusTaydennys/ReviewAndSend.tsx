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
import { HankeAlue } from '../types/hanke';
import TaydennysBasicInformationSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusBasicInformationSummary';
import TaydennysAreasSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusAreaSummary';
import TaydennysHaittojenhallintaSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/KaivuilmoitusHaittojenhallintaSummary';
import TaydennysContactsSummary from '../application/taydennysAndMuutosilmoitusCommon/components/summary/ContactsSummary';
import TaydennysAttachmentsList from '../application/taydennys/components/TaydennysAttachmentsList';
import KaivuilmoitusSummary from '../kaivuilmoitus/components/KaivuilmoitusSummary';

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

import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { Box } from '@chakra-ui/layout';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../application/types/application';
import { HankeAlue } from '../types/hanke';
import KaivuilmoitusSummary from '../kaivuilmoitus/components/KaivuilmoitusSummary';

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

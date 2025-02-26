import React from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KaivuilmoitusFormValues } from './types';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { HankeAlue } from '../types/hanke';
import KaivuilmoitusSummary from './components/KaivuilmoitusSummary';

type Props = {
  hankealueet: HankeAlue[];
  attachments: ApplicationAttachmentMetadata[] | undefined;
};

export const ReviewAndSend: React.FC<React.PropsWithChildren<Props>> = ({
  hankealueet,
  attachments,
}) => {
  const { getValues } = useFormContext<KaivuilmoitusFormValues>();
  const { t } = useTranslation();

  return (
    <div>
      <Box mb="var(--spacing-l)">
        <p>{t('kaivuilmoitusForm:yhteenveto:instructions')}</p>
      </Box>
      <KaivuilmoitusSummary
        application={getValues()}
        attachments={attachments ?? []}
        hankealueet={hankealueet}
      />
    </div>
  );
};

export default ReviewAndSend;

import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import Text from '../../common/components/text/Text';
import FileUpload from '../../common/components/fileUpload/FileUpload';
import { JohtoselvitysTaydennysFormValues } from './types';
import {
  deleteAttachment,
  downloadAttachment,
  uploadAttachment,
} from '../application/taydennys/taydennysAttachmentsApi';
import { getAttachmentFile as getApplicationAttachmentFile } from '../application/attachments';
import FileDownloadList from '../../common/components/fileDownloadList/FileDownloadList';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../forms/components/FormSummarySection';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';

type Props = {
  applicationId: number;
  taydennysAttachments: TaydennysAttachmentMetadata[];
  originalAttachments?: ApplicationAttachmentMetadata[];
};

export default function Attachments({
  applicationId,
  taydennysAttachments,
  originalAttachments,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<JohtoselvitysTaydennysFormValues>();

  function handleFileUpload(uploading: boolean) {
    if (!uploading) {
      queryClient.invalidateQueries(['application', applicationId]);
    }
  }

  return (
    <Box mb="var(--spacing-l)">
      <Text tag="p" spacingBottom="l">
        {t('johtoselvitysForm:liitteet:instructions')}
      </Text>

      <Text tag="h2" styleAs="h3" weight="bold" spacingBottom="s">
        {t('hankePortfolio:tabit:liitteet')}
      </Text>

      {originalAttachments && originalAttachments.length > 0 && (
        <FormSummarySection marginBottom="var(--spacing-m)">
          <SectionItemTitle>{t('taydennys:labels:originalAttachments')}</SectionItemTitle>
          <SectionItemContent>
            <FileDownloadList
              files={originalAttachments}
              download={(file) => getApplicationAttachmentFile(applicationId, file.id)}
            />
          </SectionItemContent>
        </FormSummarySection>
      )}

      <FileUpload
        id="cable-report-taydennys-file-upload"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={taydennysAttachments}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment(getValues('id')!, 'MUU', file, abortSignal)
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={(file) => downloadAttachment(getValues('id')!, file.id)}
        fileDeleteFunction={(file) => deleteAttachment(getValues('id'), file?.id)}
        onFileDelete={() => queryClient.invalidateQueries(['application', applicationId])}
      />
    </Box>
  );
}

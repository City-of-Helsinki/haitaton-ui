import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import Text from '../../common/components/text/Text';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import FileUpload from '../../common/components/fileUpload/FileUpload';
import { JohtoselvitysTaydennysFormValues } from './types';
import {
  deleteAttachment,
  getAttachmentFile,
  uploadAttachment,
} from '../application/taydennys/taydennysAttachmentsApi';
import { getAttachmentFile as getApplicationAttachmentFile } from '../application/attachments';
import FileDownloadList from '../../common/components/fileDownloadList/FileDownloadList';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../forms/components/FormSummarySection';

type Props = {
  applicationId: number;
  originalAttachments: ApplicationAttachmentMetadata[] | undefined;
  attachmentsLoadError: boolean;
  onFileUpload: (isUploading: boolean) => void;
};

export default function Attachments({
  applicationId,
  originalAttachments,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attachmentsLoadError,
  onFileUpload,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<JohtoselvitysTaydennysFormValues>();

  function handleFileUpload(uploading: boolean) {
    onFileUpload(uploading);
    if (!uploading) {
      queryClient.invalidateQueries('attachments');
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

      <FormSummarySection marginBottom="var(--spacing-m)">
        <SectionItemTitle>{t('taydennys:labels:originalAttachments')}</SectionItemTitle>
        <SectionItemContent>
          <FileDownloadList
            files={originalAttachments ?? []}
            download={(file) => getApplicationAttachmentFile(applicationId, file.id)}
          />
        </SectionItemContent>
      </FormSummarySection>

      <FileUpload
        id="cable-report-taydennys-file-upload"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        maxSize={104857600}
        dragAndDrop
        multiple
        // existingAttachments={existingAttachments}
        // existingAttachmentsLoadError={attachmentsLoadError}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            taydennysId: getValues('id')!,
            attachmentType: 'MUU',
            file,
            abortSignal,
          })
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={(file) => getAttachmentFile(getValues('id')!, file.id)}
        fileDeleteFunction={(file) =>
          deleteAttachment({ taydennysId: getValues('id'), attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries('attachments')}
      />
    </Box>
  );
}

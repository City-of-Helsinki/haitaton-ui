import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import Text from '../../common/components/text/Text';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { deleteAttachment, getAttachmentFile, uploadAttachment } from '../application/attachments';
import { JohtoselvitysFormValues } from './types';
import FileUpload from '../../common/components/fileUpload/FileUpload';

type Props = {
  existingAttachments: ApplicationAttachmentMetadata[] | undefined;
  attachmentsLoadError: boolean;
  onFileUpload: (isUploading: boolean) => void;
};

function Attachments({ existingAttachments, onFileUpload }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<JohtoselvitysFormValues>();
  const alluStatus = getValues('alluStatus');

  function handleFileUpload(uploading: boolean) {
    onFileUpload(uploading);
    if (!uploading) {
      queryClient.invalidateQueries('attachments');
    }
  }

  const showDeleteButton = useCallback(() => {
    return alluStatus === null;
  }, [alluStatus]);

  return (
    <Box mb="var(--spacing-l)">
      <Text tag="p" spacingBottom="l">
        {t('johtoselvitysForm:liitteet:instructions')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('hankePortfolio:tabit:liitteet')}
      </Text>

      <FileUpload
        id="cable-report-file-upload"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            applicationId: getValues('id')!,
            attachmentType: 'MUU',
            file,
            abortSignal,
          })
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={(file) => getAttachmentFile(getValues('id')!, file.id)}
        fileDeleteFunction={(file) =>
          deleteAttachment({ applicationId: getValues('id'), attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries('attachments')}
        showDeleteButtonForFile={showDeleteButton}
      />
    </Box>
  );
}

export default Attachments;

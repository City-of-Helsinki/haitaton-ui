import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, IconTrash, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import Text from '../../common/components/text/Text';
import useLocale from '../../common/hooks/useLocale';
import FileList from '../../common/components/fileList/FileList';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { deleteAttachment } from '../application/attachments';
import { JohtoselvitysFormValues } from './types';
import ErrorLoadingText from '../../common/components/errorLoadingText/ErrorLoadingText';

type Props = {
  existingAttachments: ApplicationAttachmentMetadata[] | undefined;
  attachmentsLoadError: boolean;
  newAttachments: File[];
  onAddAttachments: (files: File[]) => void;
};

function Attachments({
  existingAttachments,
  attachmentsLoadError,
  newAttachments,
  onAddAttachments,
}: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const locale = useLocale();
  const { getValues } = useFormContext<JohtoselvitysFormValues>();

  const [fileToDelete, setFileToDelete] = useState<ApplicationAttachmentMetadata | null>(null);
  const [showFileDeleteDialog, setShowFileDeleteDialog] = useState(false);
  const attachmentDeleteMutation = useMutation(deleteAttachment, {
    onSuccess() {
      queryClient.invalidateQueries('attachments');
    },
  });

  function handleFilesChange(files: File[]) {
    onAddAttachments(files);
  }

  function handleFileDelete(file: ApplicationAttachmentMetadata) {
    setFileToDelete(file);
    setShowFileDeleteDialog(true);
  }

  function confirmFileDelete() {
    attachmentDeleteMutation.mutate({
      applicationId: getValues('id'),
      attachmentId: fileToDelete?.id,
    });
    setShowFileDeleteDialog(false);
  }

  function closeFileDeleteDialog() {
    setFileToDelete(null);
    setShowFileDeleteDialog(false);
  }

  function closeDeleteSuccessNotification() {
    setFileToDelete(null);
    attachmentDeleteMutation.reset();
  }

  return (
    <Box mb="var(--spacing-l)">
      <Text tag="p" spacingBottom="l">
        {t('johtoselvitysForm:liitteet:instructions')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('hankePortfolio:tabit:liitteet')}
      </Text>

      {existingAttachments && existingAttachments.length > 0 && (
        <Box mb="var(--spacing-l)">
          <Box as="p" className="text-medium" color="var(--color-black-90)" mb="var(--spacing-xs)">
            {t('form:labels:addedFiles')}
          </Box>
          {attachmentsLoadError ? (
            <ErrorLoadingText />
          ) : (
            <FileList files={existingAttachments} onDeleteFile={handleFileDelete} />
          )}
        </Box>
      )}

      <FileInput
        id="cable-report-file-input"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        label={t('form:labels:dragAttachments')}
        dragAndDropLabel={t('form:labels:dragAttachments')}
        language={locale}
        maxSize={104857600}
        dragAndDrop
        multiple
        onChange={handleFilesChange}
        defaultValue={newAttachments}
      />

      {/* Attachment remove dialog */}
      <ConfirmationDialog
        title={t('form:dialog:titles:removeAttachment')}
        description={t('form:dialog:descriptions:removeAttachment', {
          fileName: fileToDelete?.fileName,
        })}
        isOpen={showFileDeleteDialog}
        close={closeFileDeleteDialog}
        mainAction={confirmFileDelete}
        mainBtnLabel={t('common:buttons:remove')}
        mainBtnIcon={<IconTrash aria-hidden />}
        variant="danger"
      />

      {/* Attachment delete success notification */}
      {attachmentDeleteMutation.isSuccess && (
        <Notification
          position="top-right"
          dismissible
          autoClose
          autoCloseDuration={3000}
          type="success"
          label={t('form:notifications:labels:attachmentRemoved')}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={closeDeleteSuccessNotification}
        >
          {t('form:notifications:descriptions:attachmentRemoved', {
            fileName: fileToDelete?.fileName,
          })}
        </Notification>
      )}
    </Box>
  );
}

export default Attachments;

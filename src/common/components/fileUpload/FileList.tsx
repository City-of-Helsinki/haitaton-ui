import { useState } from 'react';
import { IconTrash, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { AttachmentMetadata } from '../../types/attachment';
import ConfirmationDialog from '../HDSConfirmationDialog/ConfirmationDialog';
import FileListItem from './FileListItem';
import { FileDeleteFunction, FileDownLoadFunction } from './types';

type Props = {
  files: AttachmentMetadata[];
  fileDownLoadFunction?: FileDownLoadFunction;
  fileDeleteFunction: FileDeleteFunction;
  onFileDelete?: () => void;
};

export default function FileList({
  files,
  fileDownLoadFunction,
  fileDeleteFunction,
  onFileDelete,
}: Props) {
  const { t } = useTranslation();
  const deleteMutation = useMutation(fileDeleteFunction, {
    onSuccess() {
      onFileDelete && onFileDelete();
    },
  });
  const [fileToDelete, setFileToDelete] = useState<AttachmentMetadata | null>(null);
  const [showFileDeleteDialog, setShowFileDeleteDialog] = useState(false);

  function handleFileDelete(file: AttachmentMetadata) {
    setFileToDelete(file);
    setShowFileDeleteDialog(true);
  }

  function confirmFileDelete() {
    deleteMutation.mutate(fileToDelete);
    setShowFileDeleteDialog(false);
  }

  function closeFileDeleteDialog() {
    setFileToDelete(null);
    setShowFileDeleteDialog(false);
  }

  function closeDeleteSuccessNotification() {
    setFileToDelete(null);
    deleteMutation.reset();
  }

  return (
    <>
      <Box as="ul" tabIndex={-1} marginTop="var(--spacing-m)">
        {files.map((file) => {
          return (
            <FileListItem
              fileMetadata={file}
              key={file.id}
              onDeleteFile={handleFileDelete}
              fileDownLoadFunction={fileDownLoadFunction}
              deletingFile={fileToDelete?.id === file.id && deleteMutation.isLoading}
            />
          );
        })}
      </Box>

      {/* File remove dialog */}
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
      {deleteMutation.isSuccess && (
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
    </>
  );
}

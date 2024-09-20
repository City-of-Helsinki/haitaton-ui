import { useState } from 'react';
import { IconTrash, Notification } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AttachmentMetadata } from '../../types/attachment';
import ConfirmationDialog from '../HDSConfirmationDialog/ConfirmationDialog';
import FileListItem from './FileListItem';
import { FileDeleteFunction, FileDownLoadFunction, ShowDeleteButtonFunction } from './types';
import { AxiosError } from 'axios';
import { sortBy } from 'lodash';
import useDebouncedMutation from '../../hooks/useDebouncedMutation';

type Props = {
  files: AttachmentMetadata[];
  fileDownLoadFunction?: FileDownLoadFunction;
  fileDeleteFunction: FileDeleteFunction;
  onFileDelete?: () => void;
  showDeleteButtonForFile?: ShowDeleteButtonFunction;
};

export default function FileList({
  files,
  fileDownLoadFunction,
  fileDeleteFunction,
  onFileDelete,
  showDeleteButtonForFile,
}: Readonly<Props>) {
  const { t } = useTranslation();
  // Sort files in descending order by their createdAt date
  const sortedFiles = sortBy(files, (file) => new Date(file.createdAt)).reverse();
  const deleteMutation = useDebouncedMutation<void, AxiosError, AttachmentMetadata, unknown>(
    fileDeleteFunction,
    {
      onSuccess() {
        if (onFileDelete) {
          onFileDelete();
        }
      },
    },
  );
  const [fileToDelete, setFileToDelete] = useState<AttachmentMetadata | null>(null);
  const [showFileDeleteDialog, setShowFileDeleteDialog] = useState(false);
  const deleteErrorText: string =
    deleteMutation.error?.response?.status === 404
      ? t('common:components:fileUpload:deleteError:fileNotFound')
      : t('common:components:fileUpload:deleteError:serverError');

  function handleFileDelete(file: AttachmentMetadata) {
    setFileToDelete(file);
    setShowFileDeleteDialog(true);
  }

  function confirmFileDelete() {
    if (fileToDelete) {
      deleteMutation.mutate(fileToDelete);
    }
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

  function closeDeleteErrorDialog() {
    deleteMutation.reset();
  }

  return (
    <>
      <Box as="ul" tabIndex={-1} marginTop="var(--spacing-m)" data-testid="file-upload-list">
        {sortedFiles.map((file) => {
          return (
            <FileListItem
              file={file}
              key={file.id}
              onDeleteFile={handleFileDelete}
              fileDownLoadFunction={fileDownLoadFunction}
              deletingFile={fileToDelete?.id === file.id && deleteMutation.isLoading}
              showDeleteButtonForFile={showDeleteButtonForFile}
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

      {/* File delete success notification */}
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

      {/* File remove error dialog */}
      <ConfirmationDialog
        title={t('common:components:fileUpload:deleteError:title')}
        description={deleteErrorText}
        isOpen={deleteMutation.isError}
        close={closeDeleteErrorDialog}
        mainAction={closeDeleteErrorDialog}
        mainBtnLabel={t('common:ariaLabels:closeButtonLabelText')}
        variant="primary"
        showSecondaryButton={false}
      />
    </>
  );
}

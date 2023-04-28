import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, IconTrash } from 'hds-react';
import { Box } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import Text from '../../common/components/text/Text';
import useLocale from '../../common/hooks/useLocale';
import FileList from '../../common/components/fileList/FileList';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import useAttachmentDelete from '../application/hooks/useAttachmentDelete';

type Props = {
  existingAttachments: ApplicationAttachmentMetadata[] | undefined;
  newAttachments: File[];
  onAddAttachments: (files: File[]) => void;
};

function Attachments({ existingAttachments, newAttachments, onAddAttachments }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const locale = useLocale();
  const [fileToRemove, setFileToRemove] = useState<ApplicationAttachmentMetadata | null>(null);
  const attachmentDeleteMutation = useAttachmentDelete();

  function handleFilesChange(files: File[]) {
    onAddAttachments(files);
  }

  function handleFileRemove(file: ApplicationAttachmentMetadata) {
    setFileToRemove(file);
  }

  function confirmFileRemove() {
    attachmentDeleteMutation.mutate(fileToRemove?.id, {
      onSuccess() {
        queryClient.invalidateQueries('attachments');
      },
    });
    setFileToRemove(null);
  }

  function closeRemoveDialog() {
    setFileToRemove(null);
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
          <FileList files={existingAttachments} onRemoveFile={handleFileRemove} />
        </Box>
      )}

      <FileInput
        id="cable-report-file-input"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        label={t('form:labels:dragAttachments')}
        dragAndDropLabel={t('form:labels:dragAttachments')}
        language={locale}
        maxSize={26214400}
        dragAndDrop
        multiple
        onChange={handleFilesChange}
        defaultValue={newAttachments}
      />

      {/* File remove dialog */}
      <ConfirmationDialog
        title={t('form:dialog:titles:removeAttachment')}
        description={t('form:dialog:descriptions:removeAttachment', {
          fileName: fileToRemove?.fileName,
        })}
        isOpen={Boolean(fileToRemove)}
        close={closeRemoveDialog}
        mainAction={confirmFileRemove}
        mainBtnLabel={t('common:buttons:remove')}
        mainBtnIcon={<IconTrash aria-hidden />}
        variant="danger"
        // errorMsg={errorMessage}
      />
    </Box>
  );
}

export default Attachments;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput, IconTrash } from 'hds-react';
import { Box } from '@chakra-ui/react';
import Text from '../../common/components/text/Text';
import TextArea from '../../common/components/textArea/TextArea';
import useLocale from '../../common/hooks/useLocale';
import FileList from '../../common/components/fileList/FileList';
import ConfirmationDialog from '../../common/components/HDSConfirmationDialog/ConfirmationDialog';

type Props = {
  onAddAttachments: (files: File[]) => void;
};

function Attachments({ onAddAttachments }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [fileToRemove, setFileToRemove] = useState<File | null>(null);

  const [addedFiles, setAddedFiles] = useState<File[]>([]);

  function handleFilesChange(files: File[]) {
    setAddedFiles(files);
    onAddAttachments(files);
  }

  function handleFileRemove(file: File) {
    setFileToRemove(file);
  }

  function confirmFileRemove() {
    setFileToRemove(null);
  }

  function closeRemoveDialog() {
    setFileToRemove(null);
  }

  return (
    <div>
      <Text tag="p" spacingBottom="l">
        {t('johtoselvitysForm:liitteet:instructions')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('hankePortfolio:tabit:liitteet')}
      </Text>

      {addedFiles.length > 0 && (
        <Box mb="var(--spacing-l)">
          <Box as="p" className="text-medium" color="var(--color-black-90)" mb="var(--spacing-xs)">
            {t('form:labels:addedFiles')}
          </Box>
          <FileList files={addedFiles} onRemoveFile={handleFileRemove} />
        </Box>
      )}

      <FileInput
        id="cable-report-file-input"
        accept=".pdf,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        label={t('form:labels:dragAttachments')}
        dragAndDropLabel={t('form:labels:dragAttachments')}
        language={locale}
        maxSize={26214400}
        dragAndDrop
        multiple
        onChange={handleFilesChange}
      />

      <Text tag="h2" styleAs="h4" weight="bold" spacingTop="m" spacingBottom="s">
        {t('form:labels:additionalInfo')}
      </Text>

      <Box mb="var(--spacing-l)">
        <TextArea
          name="applicationData.additionalInfo"
          label={t('hakemus:labels:applicationAdditionalInfo')}
        />
      </Box>

      {/* File remove dialog */}
      <ConfirmationDialog
        title={t('form:dialog:titles:removeAttachment')}
        description={t('form:dialog:descriptions:removeAttachment', {
          fileName: fileToRemove?.name,
        })}
        isOpen={Boolean(fileToRemove)}
        close={closeRemoveDialog}
        mainAction={confirmFileRemove}
        mainBtnLabel={t('common:buttons:remove')}
        mainBtnIcon={<IconTrash aria-hidden />}
        variant="danger"
        // errorMsg={errorMessage}
      />
    </div>
  );
}

export default Attachments;

import { Box, Flex } from '@chakra-ui/react';
import { format, isToday } from 'date-fns';
import { fi } from 'date-fns/locale';
import { Button, IconCross, IconDocument, IconDownload } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AttachmentMetadata } from '../../types/attachment';
import FileDownloadLink from '../fileDownloadLink/FileDownloadLink';
import Text from '../text/Text';
import styles from './FileListItem.module.scss';
import { FileDownLoadFunction } from './types';

type Props = {
  fileMetadata: AttachmentMetadata;
  onDeleteFile: (file: AttachmentMetadata) => void;
  fileDownLoadFunction?: FileDownLoadFunction;
  deletingFile?: boolean;
};

export default function FileListItem({
  fileMetadata,
  onDeleteFile,
  fileDownLoadFunction,
  deletingFile = false,
}: Props) {
  const { t } = useTranslation();
  const showDeleteButton = true;
  const dateAdded = new Date(fileMetadata.createdAt);
  const dateAddedText = isToday(dateAdded)
    ? t('form:labels:today')
    : format(dateAdded, 'd.M.yyyy', { locale: fi });

  return (
    <Flex
      as="li"
      tabIndex={-1}
      className={styles.fileListItem}
      alignItems="flex-start"
      gridColumnGap="var(--spacing-xs)"
      gridRowGap="var(--spacing-2-xs)"
      mb="var(--spacing-xs)"
    >
      <IconDocument aria-hidden />
      <Flex wrap="nowrap" flex="1" alignItems="flex-start">
        {fileDownLoadFunction === undefined ? (
          <Text tag="p" className={styles.fileListItemName}>
            {fileMetadata.fileName}
          </Text>
        ) : (
          <>
            <FileDownloadLink
              linkText={fileMetadata.fileName}
              fileName={fileMetadata.fileName}
              linkTextStyles={styles.fileListItemName}
              queryKey={['attachmentContent', fileMetadata.id]}
              queryFunction={() => fileDownLoadFunction(fileMetadata)}
            />
            <IconDownload aria-hidden className={styles.fileListItemDownloadIcon} />
          </>
        )}
      </Flex>
      <Box as="p" color="var(--color-black-60)" className="text-sm">
        {t('form:labels:added')} {dateAddedText}
      </Box>
      {showDeleteButton && (
        <Button
          className={styles.fileListItemButton}
          iconLeft={<IconCross aria-hidden />}
          variant="supplementary"
          size="small"
          theme="black"
          onClick={() => onDeleteFile(fileMetadata)}
          data-testid={`delete-${fileMetadata.id}`}
          isLoading={deletingFile}
        >
          {t('common:buttons:remove')}
        </Button>
      )}
    </Flex>
  );
}

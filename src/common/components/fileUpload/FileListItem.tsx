import { Box } from '@chakra-ui/react';
import { format, isToday } from 'date-fns';
import { fi } from 'date-fns/locale';
import { Button, formatBytes, IconCross, IconDocument, IconDownload, IconPhoto } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AttachmentMetadata } from '../../types/attachment';
import FileDownloadLink from '../fileDownloadLink/FileDownloadLink';
import Text from '../text/Text';
import styles from './FileListItem.module.scss';
import { FileDownLoadFunction, ShowDeleteButtonFunction } from './types';

type Props = {
  file: AttachmentMetadata;
  onDeleteFile: (file: AttachmentMetadata) => void;
  fileDownLoadFunction?: FileDownLoadFunction;
  deletingFile?: boolean;
  showDeleteButtonForFile?: ShowDeleteButtonFunction;
};

export default function FileListItem({
  file,
  onDeleteFile,
  fileDownLoadFunction,
  deletingFile = false,
  showDeleteButtonForFile,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const sizeText = formatBytes(file.size);
  const dateAdded = new Date(file.createdAt);
  const dateAddedText = isToday(dateAdded)
    ? t('form:labels:today')
    : format(dateAdded, 'd.M.yyyy', { locale: fi });
  const showDeleteButton = showDeleteButtonForFile === undefined || showDeleteButtonForFile(file);

  function deleteFile() {
    onDeleteFile(file);
  }

  return (
    <li tabIndex={-1} className={styles.fileListItem}>
      {file.contentType.includes('image') ? (
        <IconPhoto aria-hidden />
      ) : (
        <IconDocument aria-hidden />
      )}
      <div className={styles.fileListItemNameContainer}>
        {fileDownLoadFunction === undefined ? (
          <Text tag="p" className={styles.fileListItemName}>
            {file.fileName}
          </Text>
        ) : (
          <>
            <FileDownloadLink
              linkText={file.fileName}
              fileName={file.fileName}
              linkTextStyles={styles.fileListItemName}
              queryKey={['attachmentContent', file.id]}
              queryFunction={() => fileDownLoadFunction(file)}
            />
            <IconDownload aria-hidden className={styles.fileListItemDownloadIcon} />
          </>
        )}
      </div>
      <Box as="p" className="text-sm">
        ({sizeText})
      </Box>
      <Box
        as="p"
        color="var(--color-black-60)"
        className="text-sm"
        marginRight={showDeleteButtonForFile ? 0 : 'var(--spacing-xs)'}
      >
        {t('form:labels:added')} {dateAddedText}
      </Box>
      {showDeleteButton && (
        <Button
          className={styles.fileListItemButton}
          iconLeft={<IconCross aria-hidden />}
          variant="supplementary"
          size="small"
          theme="black"
          onClick={deleteFile}
          data-testid={`delete-${file.id}`}
          isLoading={deletingFile}
        >
          {t('common:buttons:remove')}
        </Button>
      )}
    </li>
  );
}

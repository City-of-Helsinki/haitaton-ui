import React from 'react';
import { Button, IconCross, IconPhoto } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { ApplicationAttachmentMetadata } from '../../../domain/application/types/application';
import { getAttachmentFile } from '../../../domain/application/attatchments';
import FileDownloadLink from '../fileDownloadLink/FileDownloadLink';

type Props = {
  files: ApplicationAttachmentMetadata[];
  onDeleteFile: (file: ApplicationAttachmentMetadata) => void;
};

function FileList({ files, onDeleteFile }: Props) {
  const { t } = useTranslation();

  return (
    <ul data-testid="file-list">
      {files.map((fileMetadata) => {
        return (
          <Flex
            as="li"
            key={fileMetadata.id}
            alignItems="center"
            flexWrap="wrap"
            gridColumnGap="var(--spacing-xs)"
            mb="var(--spacing-2-xs)"
          >
            <FileDownloadLink
              linkText={fileMetadata.fileName}
              fileName={fileMetadata.fileName}
              linkIcon={
                <IconPhoto aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
              }
              queryKey={['attachmentContent', fileMetadata.id]}
              queryFunction={() => getAttachmentFile(fileMetadata.applicationId, fileMetadata.id)}
            />
            <Box as="p" color="var(--color-black-60)" className="text-sm">
              {t('form:labels:added')}{' '}
              {format(new Date(fileMetadata.createdAt), 'd.M.yyyy kk:mm', { locale: fi })}
            </Box>
            <Button
              iconLeft={<IconCross aria-hidden />}
              variant="supplementary"
              size="small"
              style={{ color: 'var(--color-error)' }}
              onClick={() => onDeleteFile(fileMetadata)}
              data-testid={`delete-${fileMetadata.id}`}
            >
              {t('common:buttons:remove')}
            </Button>
          </Flex>
        );
      })}
    </ul>
  );
}

export default FileList;

import React from 'react';
import { Button, IconCross, IconPhoto, Link } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ApplicationAttachmentMetadata } from '../../../domain/application/types/application';

type Props = {
  files: ApplicationAttachmentMetadata[];
  onRemoveFile: (file: ApplicationAttachmentMetadata) => void;
};

function FileList({ files, onRemoveFile }: Props) {
  const { t } = useTranslation();

  return (
    <ul>
      {files.map((file) => {
        return (
          <Flex
            as="li"
            key={file.id}
            alignItems="center"
            flexWrap="wrap"
            gridColumnGap="var(--spacing-xs)"
            mb="var(--spacing-2-xs)"
          >
            {/* TODO: Pitäisikö tehdä file download link komponentti, jossa olisi sama toiminnallisuus kuin DesicionLinkissä? */}
            <Link href="/#" size="S">
              <IconPhoto aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
              {file.fileName}
            </Link>
            <Box as="p" color="var(--color-black-60)" className="text-sm">
              {t('form:labels:added')} {format(new Date(file.createdAt), 'd.M.yyyy kk:mm')}
            </Box>
            <Button
              iconLeft={<IconCross aria-hidden />}
              variant="supplementary"
              size="small"
              style={{ color: 'var(--color-error)' }}
              onClick={() => onRemoveFile(file)}
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

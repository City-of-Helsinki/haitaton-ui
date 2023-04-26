import React from 'react';
import { Button, IconCross, IconPhoto, Link } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';

type Props = {
  files: File[];
  onRemoveFile: (file: File) => void;
};

function FileList({ files, onRemoveFile }: Props) {
  const { t } = useTranslation();

  return (
    <ul>
      {files.map((file) => {
        return (
          <Flex
            as="li"
            key={file.name}
            alignItems="center"
            flexWrap="wrap"
            gridColumnGap="var(--spacing-xs)"
            mb="var(--spacing-2-xs)"
          >
            <Link href="/#" size="S">
              <IconPhoto aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
              {file.name}
            </Link>
            <Box as="p" color="var(--color-black-60)" className="text-sm">
              {t('form:labels:added')} {format(new Date(file.lastModified), 'd.M.yyyy kk:mm')}
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

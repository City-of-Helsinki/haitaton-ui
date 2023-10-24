import { useEffect, useRef, useState } from 'react';
import { QueryKey, useMutation, useQueryClient } from 'react-query';
import { FileInput, IconCheckCircleFill, LoadingSpinner } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { differenceBy } from 'lodash';
import { AxiosError } from 'axios';
import useLocale from '../../hooks/useLocale';
import { AttachmentMetadata } from '../../types/attachment';
import { Flex } from '@chakra-ui/react';
import Text from '../text/Text';
import styles from './FileUpload.module.scss';
import { removeDuplicateAttachments } from './utils';

function useDroppedFiles() {
  const ref = useRef<HTMLDivElement>(null);
  const droppedFiles = useRef<File[]>([]);

  useEffect(() => {
    function dropHandler(ev: DragEvent) {
      if (ev.dataTransfer) {
        droppedFiles.current = Array.from(ev.dataTransfer.files);
      }
    }

    if (ref.current) {
      ref.current.ondrop = dropHandler;
    }
  }, []);

  return { ref, droppedFiles };
}

function SuccessNotification({
  successfulCount,
  totalCount,
}: {
  successfulCount: number;
  totalCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Flex color="var(--color-success)">
      <IconCheckCircleFill style={{ marginRight: 'var(--spacing-2-xs)' }} />
      <p>
        {t('common:components:fileUpload:successNotification', {
          successful: successfulCount,
          total: totalCount,
        })}
      </p>
    </Flex>
  );
}

// TODO: Kutsujen perumisen voisi tehdä omassa
// subtaskissaan, se on vielä mysteeri miten tehdään

type Props<T extends AttachmentMetadata> = {
  fileInputId: string;
  accept: string | undefined;
  maxSize: number | undefined;
  dragAndDrop: boolean | undefined;
  multiple: boolean | undefined;
  queryKey: QueryKey;
  existingAttachments?: T[];
  uploadFunction: (file: File) => Promise<T>;
  onUpload?: (isUploading: boolean) => void;
};

export default function FileUpload<T extends AttachmentMetadata>({
  fileInputId,
  accept,
  maxSize,
  dragAndDrop,
  multiple,
  queryKey,
  existingAttachments = [],
  uploadFunction,
  onUpload,
}: Props<T>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
  const uploadMutation = useMutation(uploadFunction, {
    onError(error: AxiosError, file) {
      // TODO: Invalid files pitäisi ehkä olla array of objects,
      // joissa olisi virheen syy ja tiedosto,
      // tai niin, että se on array of strings, joissa jokainen item on se
      // error teksti
      setInvalidFiles((files) => [...files, file]);
    },
  });
  const [filesUploading, setFilesUploading] = useState(false);
  const { ref: dropZoneRef, droppedFiles } = useDroppedFiles();

  async function uploadFiles(files: File[]) {
    setFilesUploading(true);
    if (onUpload) {
      onUpload(true);
    }

    const mutations = files.map((file) => {
      return uploadMutation.mutateAsync(file);
    });

    await Promise.allSettled(mutations);

    setFilesUploading(false);
    queryClient.invalidateQueries(queryKey);
    if (onUpload) {
      onUpload(false);
    }
  }

  function handleFilesChange(files: File[]) {
    // Filter out attachments that have same names as those that have already been sent
    const filesToSend = removeDuplicateAttachments(files, existingAttachments);

    // Determine which files haven't passed HDS FileInput validation by comparing
    // files in input element or files dropped into drop zone to files received as
    // argument to this onChange function
    const inputElem = document.getElementById(fileInputId) as HTMLInputElement;
    const inputElemFiles = inputElem.files ? Array.from(inputElem.files) : [];
    const allFiles = inputElemFiles.length > 0 ? inputElemFiles : droppedFiles.current;
    const invalidFilesArr = differenceBy(allFiles, filesToSend, 'name');

    setNewFiles(allFiles);
    setInvalidFiles(invalidFilesArr);
    uploadFiles(filesToSend);
  }

  return (
    <div>
      <Flex alignItems="center" className={styles.uploadContainer} ref={dropZoneRef}>
        {filesUploading ? (
          <Flex className={styles.loadingContainer}>
            <LoadingSpinner small className={styles.loadingSpinner} />
            <Text tag="p" className={styles.loadingText}>
              {t('common:components:fileUpload:loadingText')}
            </Text>
          </Flex>
        ) : (
          <FileInput
            id={fileInputId}
            accept={accept}
            label={t('form:labels:dragAttachments')}
            dragAndDropLabel={t('form:labels:dragAttachments')}
            language={locale}
            maxSize={maxSize}
            dragAndDrop={dragAndDrop}
            multiple={multiple}
            onChange={handleFilesChange}
            defaultValue={[]}
          />
        )}
      </Flex>

      {!filesUploading && newFiles.length > 0 && (
        <SuccessNotification
          successfulCount={newFiles.length - invalidFiles.length}
          totalCount={newFiles.length}
        />
      )}
    </div>
  );
}

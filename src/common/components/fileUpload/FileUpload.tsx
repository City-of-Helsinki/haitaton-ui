import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
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
import FileList from './FileList';
import { FileDeleteFunction, FileDownLoadFunction } from './types';

function useDragAndDropFiles() {
  const ref = useRef<HTMLDivElement>(null);
  const files = useRef<File[]>([]);

  useEffect(() => {
    function dropHandler(ev: DragEvent) {
      if (ev.dataTransfer) {
        files.current = Array.from(ev.dataTransfer.files);
      }
    }

    if (ref.current) {
      ref.current.ondrop = dropHandler;
    }
  }, []);

  return { ref, files };
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

type Props<T extends AttachmentMetadata> = {
  /** id of the input element */
  id: string;
  /** Label for the input */
  label?: string;
  /** A comma-separated list of unique file type specifiers describing file types to allow.  */
  accept?: string;
  /** Maximum file size in bytes. */
  maxSize?: number;
  /** If true, the file input will have a drag and drop area */
  dragAndDrop?: boolean;
  /** A Boolean that indicates that more than one file can be chosen */
  multiple?: boolean;
  existingAttachments?: T[];
  /** Function that is given to upload mutation, handling the sending of file to API */
  uploadFunction: (file: File) => Promise<T>;
  onUpload?: (isUploading: boolean) => void;
  fileDownLoadFunction?: FileDownLoadFunction;
  fileDeleteFunction: FileDeleteFunction;
  onFileDelete?: () => void;
};

export default function FileUpload<T extends AttachmentMetadata>({
  id,
  label,
  accept,
  maxSize,
  dragAndDrop,
  multiple,
  existingAttachments = [],
  uploadFunction,
  onUpload,
  fileDownLoadFunction,
  fileDeleteFunction,
  onFileDelete,
}: Props<T>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
  const uploadMutation = useMutation(uploadFunction, {
    onError(error: AxiosError, file) {
      setInvalidFiles((files) => [...files, file]);
    },
  });
  const [filesUploading, setFilesUploading] = useState(false);
  const { ref: dropZoneRef, files: dragAndDropFiles } = useDragAndDropFiles();

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
    if (onUpload) {
      onUpload(false);
    }
  }

  function handleFilesChange(files: File[]) {
    // Filter out attachments that have same names as those that have already been sent
    const [filesToUpload] = removeDuplicateAttachments(files, existingAttachments);

    // Determine which files haven't passed HDS FileInput validation by comparing
    // files in input element or files dropped into drop zone to files received as
    // argument to this onChange function
    const inputElem = document.getElementById(id) as HTMLInputElement;
    const inputElemFiles = inputElem.files ? Array.from(inputElem.files) : [];
    const allFiles = inputElemFiles.length > 0 ? inputElemFiles : dragAndDropFiles.current;
    const invalidFilesArr = differenceBy(allFiles, filesToUpload, 'name');

    setNewFiles(allFiles);
    setInvalidFiles(invalidFilesArr);
    uploadFiles(filesToUpload);
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
            id={id}
            accept={accept}
            label={label ?? t('form:labels:dragAttachments')}
            dragAndDropLabel={t('form:labels:dragAttachments')}
            language={locale}
            maxSize={maxSize}
            dragAndDrop={dragAndDrop}
            multiple={multiple}
            onChange={handleFilesChange}
          />
        )}
      </Flex>

      {!filesUploading && newFiles.length > 0 && (
        <SuccessNotification
          successfulCount={newFiles.length - invalidFiles.length}
          totalCount={newFiles.length}
        />
      )}

      <FileList
        files={existingAttachments}
        fileDownLoadFunction={fileDownLoadFunction}
        fileDeleteFunction={fileDeleteFunction}
        onFileDelete={onFileDelete}
      />
    </div>
  );
}

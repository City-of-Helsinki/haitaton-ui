import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Flex } from '@chakra-ui/react';
import {
  Button,
  FileInput,
  IconAlertCircleFill,
  IconCheckCircleFill,
  IconCross,
  LoadingSpinner,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { differenceBy } from 'lodash';
import { AxiosError } from 'axios';
import useLocale from '../../hooks/useLocale';
import { AttachmentMetadata } from '../../types/attachment';
import Text from '../text/Text';
import styles from './FileUpload.module.scss';
import { removeDuplicateAttachments } from './utils';
import FileList from './FileList';
import { FileDeleteFunction, FileDownLoadFunction, ShowDeleteButtonFunction } from './types';

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
  newFiles,
}: Readonly<{
  successfulCount: number;
  newFiles: number;
}>) {
  const { t } = useTranslation();

  return (
    <Flex color="var(--color-success)">
      <IconCheckCircleFill style={{ marginRight: 'var(--spacing-2-xs)' }} />
      <p>
        {t('common:components:fileUpload:successNotification', {
          successful: successfulCount,
          newFiles: newFiles,
        })}
      </p>
    </Flex>
  );
}

function ErrorNotification({ errors, newFiles }: Readonly<{ errors: string[]; newFiles: number }>) {
  const { t } = useTranslation();

  return (
    <Flex color="var(--color-error)">
      <IconAlertCircleFill style={{ marginRight: 'var(--spacing-2-xs)' }} />
      <div>
        <p>
          {t('common:components:fileUpload:errorNotification', {
            errors: errors.length,
            newFiles: newFiles,
          })}
        </p>
        <ul style={{ listStyle: 'none' }}>
          {errors.map((error, index) => (
            <li key={index}>- {error}</li>
          ))}
        </ul>
      </div>
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
  uploadFunction: (props: { file: File; abortSignal?: AbortSignal }) => Promise<T>;
  onUpload?: (isUploading: boolean) => void;
  fileDownLoadFunction?: FileDownLoadFunction;
  fileDeleteFunction: FileDeleteFunction;
  onFileDelete?: () => void;
  showDeleteButtonForFile?: ShowDeleteButtonFunction;
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
  showDeleteButtonForFile,
}: Readonly<Props<T>>) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [fileUploadErrors, setFileUploadErrors] = useState<string[]>([]);
  const uploadMutation = useMutation(uploadFunction, {
    onError(error: AxiosError, { file }) {
      let errorText: string;
      if (error.code === 'ERR_CANCELED') {
        errorText = t('form:errors:fileUploadCancelled', { fileName: file.name });
      } else {
        errorText =
          error.response?.status === 400
            ? t('form:errors:fileLoadBadFileError', { fileName: file.name })
            : t('form:errors:fileLoadTechnicalError', { fileName: file.name });
      }
      setFileUploadErrors((errors) => {
        return [...errors, errorText];
      });
    },
  });
  const [filesUploading, setFilesUploading] = useState(false);
  const { ref: dropZoneRef, files: dragAndDropFiles } = useDragAndDropFiles();
  const abortController = useRef<AbortController>();

  async function uploadFiles(files: File[]) {
    setFilesUploading(true);
    if (onUpload) {
      onUpload(true);
    }

    if (files.length === 0) {
      await Promise.resolve();
    } else {
      abortController.current = new AbortController();
      for (const file of files) {
        try {
          await uploadMutation.mutateAsync({
            file,
            abortSignal: abortController.current?.signal,
          });
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }
    }

    setFilesUploading(false);
    if (onUpload) {
      onUpload(false);
    }
  }

  function handleFilesChange(validFiles: File[]) {
    // Filter out attachments that have same names as those that have already been sent
    const [filesToUpload, duplicateFiles] = removeDuplicateAttachments(
      validFiles,
      existingAttachments,
    );

    // Determine which files haven't passed HDS FileInput validation by comparing
    // files in input element or files dropped into drop zone to files received as
    // argument to this onChange function
    const inputElem = document.getElementById(id) as HTMLInputElement;
    const inputElemFiles = inputElem.files ? Array.from(inputElem.files) : [];
    const allFiles = inputElemFiles.length > 0 ? inputElemFiles : dragAndDropFiles.current;

    const invalidFiles = differenceBy(allFiles, validFiles, 'name');
    const errors: string[] = invalidFiles
      .map((file) => t('form:errors:fileLoadBadFileError', { fileName: file.name }))
      .concat(
        duplicateFiles.map((file) => t('form:errors:duplicateFileError', { fileName: file.name })),
      );
    setFileUploadErrors(errors);
    setNewFiles(allFiles);
    uploadFiles(filesToUpload);
  }

  function handleFileDelete() {
    setNewFiles([]);
    setFileUploadErrors([]);
    if (onFileDelete) {
      onFileDelete();
    }
  }

  function cancelRequests() {
    abortController.current?.abort();
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
            <Button
              variant="supplementary"
              iconLeft={<IconCross aria-hidden />}
              style={{ color: 'var(--color-error)' }}
              onClick={cancelRequests}
            >
              {t('common:confirmationDialog:cancelButton')}
            </Button>
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
          successfulCount={newFiles.length - fileUploadErrors.length}
          newFiles={newFiles.length}
        />
      )}

      {!filesUploading && fileUploadErrors.length > 0 && (
        <ErrorNotification errors={fileUploadErrors} newFiles={newFiles.length} />
      )}

      <FileList
        files={existingAttachments}
        fileDownLoadFunction={fileDownLoadFunction}
        fileDeleteFunction={fileDeleteFunction}
        onFileDelete={handleFileDelete}
        showDeleteButtonForFile={showDeleteButtonForFile}
      />
    </div>
  );
}

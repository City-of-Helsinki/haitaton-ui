import { AttachmentMetadata } from '../../types/attachment';

// Filter out duplicate files based on file name
export function removeDuplicateAttachments<T extends AttachmentMetadata>(
  files: File[],
  attachments: T[] | undefined,
): [File[], File[]] {
  const duplicateFiles = files.filter(
    (file) => attachments?.some((attachment) => attachment.fileName === file.name),
  );
  const newFiles = files.filter(
    (file) => attachments?.every((attachment) => attachment.fileName !== file.name),
  );
  return [newFiles, duplicateFiles];
}

import { AttachmentMetadata } from '../../types/attachment';

// Filter out duplicate files based on file name
export function removeDuplicateAttachments<T extends AttachmentMetadata>(
  addedFiles: File[],
  existingAttachments: T[] | undefined,
): [File[], File[]] {
  const duplicateFiles = addedFiles.filter(
    (file) => existingAttachments?.some((attachment) => attachment.fileName === file.name),
  );
  const newFiles = addedFiles.filter(
    (file) => existingAttachments?.every((attachment) => attachment.fileName !== file.name),
  );
  return [newFiles, duplicateFiles];
}

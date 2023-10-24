import { AttachmentMetadata } from '../../types/attachment';

// Filter out duplicate files based on file name
export function removeDuplicateAttachments<T extends AttachmentMetadata>(
  files: File[],
  attachments: T[] | undefined,
): File[] {
  return files.filter(
    (file) => attachments?.every((attachment) => attachment.fileName !== file.name),
  );
}

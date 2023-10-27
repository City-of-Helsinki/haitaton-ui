import { AttachmentMetadata } from '../../types/attachment';

export type FileDownLoadFunction = (file: AttachmentMetadata) => Promise<string>;

export type FileDeleteFunction = (file: AttachmentMetadata | null) => Promise<void>;

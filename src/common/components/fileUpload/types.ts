import { AttachmentMetadata } from '../../types/attachment';

export type FileDownLoadFunction = (file: AttachmentMetadata) => Promise<string>;

export type FileDeleteFunction = (file: AttachmentMetadata) => Promise<void>;

export type ShowDeleteButtonFunction = (file: AttachmentMetadata) => boolean;

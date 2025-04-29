import { AttachmentMetadata } from '../../../common/types/attachment';
import { AttachmentType } from '../types/application';

export type MuutosilmoitusSent = Date | null;

export interface MuutosilmoitusAttachmentMetadata extends AttachmentMetadata {
  muutosilmoitusId: string;
  attachmentType: AttachmentType;
}

export type Muutosilmoitus<T> = {
  id: string;
  applicationData: T;
  sent: MuutosilmoitusSent;
  muutokset: string[];
  liitteet: MuutosilmoitusAttachmentMetadata[];
};

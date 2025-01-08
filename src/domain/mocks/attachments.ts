import { faker } from '@faker-js/faker/.';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';
import { ApplicationAttachmentMetadata, AttachmentType } from '../application/types/application';

function createAttachment(
  id: number | string,
  attachment: Partial<ApplicationAttachmentMetadata | TaydennysAttachmentMetadata>,
): ApplicationAttachmentMetadata | TaydennysAttachmentMetadata {
  const metadata = {
    id: attachment.id ?? faker.string.uuid(),
    fileName: attachment.fileName ?? faker.system.commonFileName('pdf'),
    attachmentType:
      attachment.attachmentType ??
      faker.helpers.arrayElement<AttachmentType>(['MUU', 'LIIKENNEJARJESTELY', 'VALTAKIRJA']),
    contentType: attachment.contentType ?? 'application/pdf',
    size: attachment.size ?? faker.number.int({ min: 1, max: 1000000 }),
    createdByUserId: attachment.createdByUserId ?? faker.string.uuid(),
    createdAt: attachment.createdAt ?? faker.date.recent().toISOString(),
  };

  if (typeof id === 'number') {
    return { ...metadata, applicationId: id } as ApplicationAttachmentMetadata;
  }
  return { ...metadata, taydennysId: id } as TaydennysAttachmentMetadata;
}

export function createTaydennysAttachments(
  taydennysId: string,
  attachments: Partial<TaydennysAttachmentMetadata>[],
): TaydennysAttachmentMetadata[] {
  return attachments.map((attachment) =>
    createAttachment(taydennysId, attachment),
  ) as TaydennysAttachmentMetadata[];
}

export function createApplicationAttachments(
  applicationId: number,
  attachments: Partial<ApplicationAttachmentMetadata>[],
): ApplicationAttachmentMetadata[] {
  return attachments.map((attachment) =>
    createAttachment(applicationId, attachment),
  ) as ApplicationAttachmentMetadata[];
}

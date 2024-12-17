import { faker } from '@faker-js/faker/.';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';
import { ApplicationAttachmentMetadata, AttachmentType } from '../application/types/application';

function createTaydennysAttachment(taydennysId: string): TaydennysAttachmentMetadata {
  return {
    id: faker.string.uuid(),
    taydennysId,
    fileName: faker.system.commonFileName('pdf'),
    attachmentType: faker.helpers.arrayElement<AttachmentType>(['MUU', 'LIIKENNEJARJESTELY']),
    contentType: 'application/pdf',
    size: faker.number.int({ min: 1, max: 1000000 }),
    createdByUserId: faker.string.uuid(),
    createdAt: faker.date.recent().toISOString(),
  };
}

export function createTaydennysAttachments(
  taydennysId: string,
  count: number,
): TaydennysAttachmentMetadata[] {
  return Array.from({ length: count }, () => createTaydennysAttachment(taydennysId));
}

function createApplicationAttachment(applicationId: number): ApplicationAttachmentMetadata {
  return {
    id: faker.string.uuid(),
    applicationId,
    fileName: faker.system.commonFileName('pdf'),
    attachmentType: faker.helpers.arrayElement<AttachmentType>(['MUU', 'LIIKENNEJARJESTELY']),
    contentType: 'application/pdf',
    size: faker.number.int({ min: 1, max: 1000000 }),
    createdByUserId: faker.string.uuid(),
    createdAt: faker.date.recent().toISOString(),
  };
}

export function createApplicationAttachments(
  applicationId: number,
  count: number,
): ApplicationAttachmentMetadata[] {
  return Array.from({ length: count }, () => createApplicationAttachment(applicationId));
}

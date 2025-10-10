import { screen, waitFor, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import * as applicationAttachmentsApi from '../../domain/application/attachments';
import { ApplicationAttachmentMetadata } from '../../domain/application/types/application';

/**
 * uploadTestAttachments
 * Uploads a map of logical attachment "type" keys to File objects inside the Kaivuilmoitus attachments step.
 * The helper:
 *  - Navigates to the attachments tab if not already there.
 *  - Locates dropzones primarily by accessible label; falls back to known input IDs if necessary.
 *  - Heuristically maps provided keys (liikenne/traffic, valtakirja/mandate, other/muu) to target dropzone index.
 *  - Mocks applicationAttachmentsApi.uploadAttachment when not already mocked, returning minimal metadata.
 *  - Waits for the expected number of upload calls before returning the uploaded file names (in call order).
 *
 * Returns array of uploaded file names.
 *
 * NOTE: This helper asserts only that the upload API calls occurred; tests can add UI-level assertions separately.
 */
export async function uploadTestAttachments(
  user: UserEvent,
  filesByType: Record<string, File>,
): Promise<string[]> {
  // Reuse existing spy if present, otherwise create a mock implementation.
  let uploadSpy = jest.spyOn(applicationAttachmentsApi, 'uploadAttachment');
  if (!uploadSpy.getMockImplementation()) {
    uploadSpy = jest
      .spyOn(applicationAttachmentsApi, 'uploadAttachment')
      .mockImplementation(async (args) => {
        return {
          id: `${Math.random()}`,
          fileName: args.file.name,
          contentType: args.file.type || 'application/octet-stream',
          size: args.file.size,
          createdByUserId: 'test-user',
          createdAt: new Date().toISOString(),
          applicationId: args.applicationId,
          attachmentType: args.attachmentType,
        } as ApplicationAttachmentMetadata;
      });
  }

  // Navigate to attachments tab if needed
  const attachmentsButton = screen.queryByRole('button', { name: /liitteet/i });
  if (attachmentsButton) await user.click(attachmentsButton);

  // Collect dropzones / file inputs
  let dropzones = screen.queryAllByLabelText('Raahaa tiedostot tänne');
  if (!dropzones.length) {
    const ids = [
      'excavation-notification-file-upload-traffic-arrangement-plan',
      'excavation-notification-file-upload-mandate',
      'excavation-notification-file-upload-other-attachments',
    ];
    dropzones = ids
      .map((id) => document.querySelector(`#${id} input[type=file]`) as HTMLElement | null)
      .filter((e): e is HTMLElement => !!e);
  }

  const typeOrder = Object.keys(filesByType);
  for (const type of typeOrder) {
    const file = filesByType[type];
    let index = 2; // default other/misc
    if (/liikenne|traffic/i.test(type)) index = 0;
    else if (/valtakirja|mandate/i.test(type)) index = 1;
    if (!dropzones[index]) continue; // tolerate missing inputs
    await user.upload(dropzones[index], file);
  }

  await waitFor(() => expect(uploadSpy).toHaveBeenCalledTimes(typeOrder.length), { timeout: 8000 });
  return uploadSpy.mock.calls.map((c) => c[0].file.name);
}

/**
 * assertAttachmentPresent
 * Convenience assertion to ensure a file name appears exactly once across all list items within file upload lists.
 */
export function assertAttachmentPresent(fileName: string) {
  const lists = screen.getAllByTestId('file-upload-list');
  const items = lists.flatMap((l) => within(l).getAllByRole('listitem'));
  const occurrences = items.filter((i) => i.textContent?.includes(fileName));
  expect(occurrences.length).toBe(1);
}

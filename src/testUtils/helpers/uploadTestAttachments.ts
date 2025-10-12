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

  // Collect dropzones / file inputs. Prefer the accessible labelled dropzones but wait for them
  // since some implementations render them async. If none found within a short timeout, fall
  // back to looking up known input IDs.
  let dropzones: HTMLElement[] = [];
  try {
    dropzones = await screen.findAllByLabelText('Raahaa tiedostot tänne', undefined, {
      timeout: 2000,
    });
  } catch {
    // ignore and fall back to ID based lookup below
  }

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
  // Resolve target input element for each provided file and group files by input so that
  // we can upload multiple files to the same input in a single user.upload call.
  const inputToFiles = new Map<HTMLElement, File[]>();
  for (const type of typeOrder) {
    const file = filesByType[type];
    let targetInput: HTMLElement | null = null;
    if (/liikenne|traffic/i.test(type)) {
      targetInput =
        (document.querySelector(
          `#excavation-notification-file-upload-traffic-arrangement-plan input[type=file]`,
        ) as HTMLElement) || null;
    } else if (/valtakirja|mandate/i.test(type)) {
      targetInput =
        (document.querySelector(
          `#excavation-notification-file-upload-mandate input[type=file]`,
        ) as HTMLElement) || null;
    } else {
      targetInput =
        (document.querySelector(
          `#excavation-notification-file-upload-other-attachments input[type=file]`,
        ) as HTMLElement) || null;
    }

    if (!targetInput) {
      let index = 2; // default other/misc
      if (/liikenne|traffic/i.test(type)) index = 0;
      else if (/valtakirja|mandate/i.test(type)) index = 1;
      targetInput = dropzones[index] || dropzones[0] || null;
    }

    if (!targetInput) continue; // tolerate missing inputs

    const existing = inputToFiles.get(targetInput) || [];
    existing.push(file);
    inputToFiles.set(targetInput, existing);
  }

  // Perform the uploads grouped by input element. For each input, upload all files at once
  // so that components that use a single unified FileUpload receive them in one change event.
  let totalFiles = 0;
  for (const files of inputToFiles.values()) totalFiles += files.length;
  for (const [input, files] of inputToFiles.entries()) {
    if (files.length === 1) {
      await user.upload(input, files[0]);
    } else {
      await user.upload(input, files);
    }
  }

  await waitFor(() => expect(uploadSpy).toHaveBeenCalledTimes(totalFiles), { timeout: 8000 });
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

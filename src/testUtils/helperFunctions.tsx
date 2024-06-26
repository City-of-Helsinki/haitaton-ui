import { fireEvent, RenderResult, screen, waitForElementToBeRemoved } from '@testing-library/react';
import {
  ApplicationAttachmentMetadata,
  AttachmentType,
} from '../domain/application/types/application';
import api from '../domain/api/api';
import { server } from '../domain/mocks/test-server';
import { rest } from 'msw';

export const changeFilterDate = (
  label: string,
  renderedComponent: RenderResult,
  value: string | null,
) => {
  fireEvent.change(renderedComponent.getByLabelText(label, { exact: false }), {
    target: { value },
  });
};

export function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(() => screen.queryByText(/page is loading/i), {
    timeout: 20000,
  });
}

export async function uploadApplicationAttachmentMock({
  applicationId,
  attachmentType,
  file,
  abortSignal,
}: {
  applicationId: number;
  attachmentType: AttachmentType;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<ApplicationAttachmentMetadata>(
    `/hakemukset/${applicationId}/liitteet?tyyppi=${attachmentType}`,
    { liite: file },
    {
      signal: abortSignal,
    },
  );
  return data;
}

export function initApplicationAttachmentGetResponse(response: ApplicationAttachmentMetadata[]) {
  server.use(
    rest.get('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(response));
    }),
  );
}

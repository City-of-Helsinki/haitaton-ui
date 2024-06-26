import { fireEvent, RenderResult, waitForElementToBeRemoved } from '@testing-library/react';
import {
  ApplicationAttachmentMetadata,
  AttachmentType,
} from '../domain/application/types/application';
import api from '../domain/api/api';
import { server } from '../domain/mocks/test-server';
import { rest } from 'msw';
import { screen } from './render';

export const changeFilterDate = (
  label: string,
  renderedComponent: RenderResult,
  value: string | null,
) => {
  fireEvent.change(renderedComponent.getByLabelText(label, { exact: false }), {
    target: { value },
  });
};

export function waitForLoadingToFinish(
  queryByText: (text: string | RegExp) => HTMLElement | null = screen.queryByText,
) {
  return waitForElementToBeRemoved(() => queryByText(/page is loading/i), {
    timeout: 4000,
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

export async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

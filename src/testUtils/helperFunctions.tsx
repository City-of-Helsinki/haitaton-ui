import { fireEvent, RenderResult, waitForElementToBeRemoved } from '@testing-library/react';
import {
  ApplicationAttachmentMetadata,
  AttachmentType,
} from '../domain/application/types/application';
import api from '../domain/api/api';
import { server } from '../domain/mocks/test-server';
import { http, HttpResponse } from 'msw';
import { screen } from './render';
import { HaittaIndexData } from '../domain/common/haittaIndexes/types';

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
  return waitForElementToBeRemoved(() => screen.queryByText(/Ladataan/i), {
    timeout: 10000,
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
    http.get('/api/hakemukset/:id/liitteet', async () => {
      return HttpResponse.json(response);
    }),
  );
}

export function initHaittaindeksitPostResponse(response: HaittaIndexData) {
  server.use(
    http.post('/api/haittaindeksit', async () => {
      return HttpResponse.json(response);
    }),
  );
}

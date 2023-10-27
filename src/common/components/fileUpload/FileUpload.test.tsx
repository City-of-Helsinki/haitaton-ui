import React from 'react';
import { rest } from 'msw';
import { act, fireEvent, render, screen, waitFor } from '../../../testUtils/render';
import api from '../../../domain/api/api';
import FileUpload from './FileUpload';
import { server } from '../../../domain/mocks/test-server';

async function uploadAttachment({ id, file }: { id: number; file: File }) {
  const { data } = await api.post(`/hakemukset/${id}/liitteet`, {
    liite: file,
  });
  return data;
}

function uploadFunction(file: File) {
  return uploadAttachment({
    id: 1,
    file,
  });
}

test('Should upload files successfully and loading indicator is displayed', async () => {
  server.use(
    rest.post('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.delay(), ctx.status(200));
    }),
  );

  const inputLabel = 'Choose a file';
  const { user } = render(
    <FileUpload
      id="test-file-upload"
      label={inputLabel}
      accept=".png,.jpg"
      multiple
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
    />,
  );
  const fileUpload = screen.getByLabelText(inputLabel);
  user.upload(fileUpload, [
    new File(['test-a'], 'test-file-a.png', { type: 'image/png' }),
    new File(['test-b'], 'test-file-b.jpg', { type: 'image/jpg' }),
  ]);

  await waitFor(() => screen.findByText('Tallennetaan tiedostoja'));
  await act(async () => {
    waitFor(() => expect(screen.queryByText('Tallennetaan tiedostoja')).not.toBeInTheDocument());
  });
  await waitFor(() => {
    expect(screen.queryByText('2/2 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
});

test('Should show amount of successful files uploaded correctly when file fails in validation', async () => {
  const inputLabel = 'Choose a file';
  const { user } = render(
    <FileUpload
      id="test-file-upload"
      label={inputLabel}
      accept=".png"
      multiple
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
    />,
    undefined,
    undefined,
    { applyAccept: false },
  );
  const fileUpload = screen.getByLabelText(inputLabel);
  user.upload(fileUpload, [
    new File(['test-a'], 'test-file-a.png', { type: 'image/png' }),
    new File(['test-b'], 'test-file-b.pdf', { type: 'application/pdf' }),
  ]);

  await waitFor(() => {
    expect(screen.queryByText('1/2 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
});

test('Should show amount of successful files uploaded correctly when request fails', async () => {
  server.use(
    rest.post('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const inputLabel = 'Choose a file';
  const { user } = render(
    <FileUpload
      id="test-file-upload"
      label={inputLabel}
      accept=".png,.jpg"
      multiple
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
    />,
  );
  const fileUpload = screen.getByLabelText(inputLabel);
  user.upload(fileUpload, [new File(['test-a'], 'test-file-a.png', { type: 'image/png' })]);

  await waitFor(() => {
    expect(screen.queryByText('0/1 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
});

test('Should upload files when user drops them into drag-and-drop area', async () => {
  const inputLabel = 'Choose files';
  const file = new File(['test-file'], 'test-file-a', { type: 'image/png' });
  const file2 = new File(['test-file'], 'test-file-b', { type: 'image/png' });
  const file3 = new File(['test-file'], 'test-file-c', { type: 'image/png' });
  render(
    <FileUpload
      id="test-file-input"
      label={inputLabel}
      multiple
      dragAndDrop
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
    />,
  );
  fireEvent.drop(screen.getByText('Raahaa tiedostot tänne'), {
    dataTransfer: {
      files: [file, file2, file3],
    },
  });

  await waitFor(() => {
    expect(screen.queryByText('3/3 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
});

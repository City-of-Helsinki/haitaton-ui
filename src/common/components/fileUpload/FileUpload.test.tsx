import React from 'react';
import { rest } from 'msw';
import { act, fireEvent, render, screen, waitFor, within } from '../../../testUtils/render';
import api from '../../../domain/api/api';
import FileUpload from './FileUpload';
import { server } from '../../../domain/mocks/test-server';
import { AttachmentMetadata } from '../../types/attachment';
import { deleteAttachment } from '../../../domain/application/attachments';

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

test('Should list added files', async () => {
  const fileNameA = 'TestFile1.pdf';
  const fileA: AttachmentMetadata = {
    id: '4f08ce3f-a0de-43c6-8ccc-9fe93822ed18',
    fileName: fileNameA,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T12:07:52.324684Z',
  };
  const fileNameB = 'TestFile2.png';
  const fileB: AttachmentMetadata = {
    id: 'd8e43d5a-ac40-448b-ad35-92120a7f2377',
    fileName: fileNameB,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: new Date().toISOString(),
  };
  const files: AttachmentMetadata[] = [fileA, fileB];
  render(
    <FileUpload
      id="test-file-input"
      label="Choose a file"
      multiple
      dragAndDrop
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
      existingAttachments={files}
    />,
  );
  const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
  const fileListItems = getAllByRole('listitem');
  expect(fileListItems.length).toBe(2);

  const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
  const { getByText: getByTextInA } = within(fileItemA!);
  expect(getByTextInA('Lisätty 4.7.2023')).toBeInTheDocument();

  const fileItemB = fileListItems.find((i) => i.innerHTML.includes(fileNameB));
  const { getByText: getByTextInB } = within(fileItemB!);
  expect(getByTextInB('Lisätty tänään')).toBeInTheDocument();
});

test('Should be able to delete file', async () => {
  const fileNameA = 'TestFile1.jpg';
  const fileA: AttachmentMetadata = {
    id: '4f08ce3f-a0de-43c6-8ccc-9fe93822ed54',
    fileName: fileNameA,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T12:07:52.324684Z',
  };
  const fileNameB = 'TestFile2.pdf';
  const fileB: AttachmentMetadata = {
    id: 'd8e43d5a-ac40-448b-ad35-92120a7f2367',
    fileName: fileNameB,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-09-06T12:09:55.324684Z',
  };
  const files: AttachmentMetadata[] = [fileA, fileB];
  const { user } = render(
    <FileUpload
      id="test-file-input"
      label="Choose a file"
      multiple
      dragAndDrop
      uploadFunction={uploadFunction}
      fileDeleteFunction={(file) => deleteAttachment({ applicationId: 1, attachmentId: file?.id })}
      existingAttachments={files}
    />,
  );
  const { getAllByRole } = within(screen.getByTestId('file-upload-list'));
  const fileListItems = getAllByRole('listitem');
  const fileItemA = fileListItems.find((i) => i.innerHTML.includes(fileNameA));
  const { getByRole: getByRoleInA } = within(fileItemA!);
  await user.click(getByRoleInA('button', { name: 'Poista' }));
  const { getByRole: getByRoleInDialog, getByText: getByTextInDialog } = within(
    screen.getByRole('dialog'),
  );

  expect(
    getByTextInDialog(`Haluatko varmasti poistaa liitetiedoston ${fileNameA}`),
  ).toBeInTheDocument();
  await user.click(getByRoleInDialog('button', { name: 'Poista' }));
  expect(screen.getByText(`Liitetiedosto ${fileNameA} poistettu`)).toBeInTheDocument();
});

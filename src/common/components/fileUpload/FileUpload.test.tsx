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

function uploadFunction({ file }: { file: File }) {
  return uploadAttachment({
    id: 1,
    file,
  });
}

test('Should upload files successfully and loading indicator is displayed', async () => {
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

test('Should show amount of successful files uploaded and errors correctly when files fails in validation', async () => {
  const fileNameA = 'test-file-a.png';
  const fileNameB = 'test-file-b.pdf';
  const fileNameC = 'test-file-c.png';
  const fileNameD = 'test-file-d.png';
  const existingFileA: AttachmentMetadata = {
    id: '4f08ce3f-a0de-43c6-8ccc-9fe93822ed18',
    fileName: fileNameA,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T12:07:52.324684Z',
  };
  const existingFileB: AttachmentMetadata = {
    id: '4f08ce3f-a0de-43c6-8ccc-9fe93822ed20',
    fileName: fileNameD,
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T12:08:52.324684Z',
  };
  const inputLabel = 'Choose a file';
  const { user } = render(
    <FileUpload
      id="test-file-upload"
      label={inputLabel}
      accept=".png"
      multiple
      uploadFunction={uploadFunction}
      fileDeleteFunction={() => Promise.resolve()}
      existingAttachments={[existingFileA, existingFileB]}
    />,
    undefined,
    undefined,
    { applyAccept: false },
  );
  const fileUpload = screen.getByLabelText(inputLabel);
  user.upload(fileUpload, [
    new File(['test-a'], fileNameA, { type: 'image/png' }),
    new File(['test-b'], fileNameB, { type: 'application/pdf' }),
    new File(['test-c'], fileNameC, { type: 'image/png' }),
  ]);

  await waitFor(() => {
    expect(screen.queryByText('1/3 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
  expect(
    screen.queryByText('Liitteen tallennus epäonnistui 2/3 tiedostolle', { exact: false }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      `Tiedosto (${fileNameB}) on viallinen. Tarkistathan, että tiedostomuoto on oikea eikä sen koko ylitä sallittua maksimikokoa.`,
      { exact: false },
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      `Valittu tiedostonimi (${fileNameA}) on jo käytössä. Nimeä tiedosto uudelleen.`,
      { exact: false },
    ),
  ).toBeInTheDocument();
});

test('Should show amount of successful files uploaded and errors correctly when request fails for bad request', async () => {
  server.use(
    rest.post('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const fileNameA = 'test-file-a.png';
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
  user.upload(fileUpload, [new File(['test-a'], fileNameA, { type: 'image/png' })]);

  await waitFor(() => {
    expect(screen.queryByText('0/1 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
  expect(
    screen.queryByText('Liitteen tallennus epäonnistui 1/1 tiedostolle', { exact: false }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      `Tiedosto (${fileNameA}) on viallinen. Tarkistathan, että tiedostomuoto on oikea eikä sen koko ylitä sallittua maksimikokoa.`,
      { exact: false },
    ),
  ).toBeInTheDocument();
});

test('Should show correct error message when request fails for server error', async () => {
  server.use(
    rest.post('/api/hakemukset/:id/liitteet', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const fileNameA = 'test-file-a.png';
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
  user.upload(fileUpload, [new File(['test-a'], fileNameA, { type: 'image/png' })]);

  await waitFor(() => {
    expect(screen.queryByText('0/1 tiedosto(a) tallennettu')).toBeInTheDocument();
  });
  expect(
    screen.queryByText('Liitteen tallennus epäonnistui 1/1 tiedostolle', { exact: false }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      `Tiedoston (${fileNameA}) lataus epäonnistui, yritä hetken päästä uudelleen.`,
      { exact: false },
    ),
  ).toBeInTheDocument();
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

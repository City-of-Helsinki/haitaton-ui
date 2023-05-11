import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { ApplicationAttachmentMetadata } from '../../../domain/application/types/application';
import { render, screen } from '../../../testUtils/render';
import FileList from './FileList';

const files: ApplicationAttachmentMetadata[] = [
  {
    id: '4f08ce3f-a0de-43c6-8ccc-9fe93822ed18',
    fileName: 'TestFile1.pdf',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T12:07:52.324684Z',
    scanStatus: 'OK',
    applicationId: 1,
    attachmentType: 'MUU',
  },
  {
    id: 'd8e43d5a-ac40-448b-ad35-92120a7f2377',
    fileName: 'TestFile2.pdf',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-07-04T13:06:28.499551Z',
    scanStatus: 'OK',
    applicationId: 1,
    attachmentType: 'MUU',
  },
];

function FileListContainer() {
  const [fileList, setFileList] = useState(() => cloneDeep(files));

  function handleFileDelete(file: ApplicationAttachmentMetadata) {
    setFileList((list) => list.filter((item) => item.id !== file.id));
  }

  return <FileList files={fileList} onDeleteFile={handleFileDelete} />;
}

test('lists files correctly', () => {
  const handleFileDelete = jest.fn();

  render(<FileList files={files} onDeleteFile={handleFileDelete} />);

  expect(screen.getByTestId('file-list').childElementCount).toBe(2);
  expect(screen.queryByText('TestFile1.pdf')).toBeInTheDocument();
  expect(screen.queryByText('TestFile2.pdf')).toBeInTheDocument();
});

test('files can be deleted from the list', async () => {
  const { user } = render(<FileListContainer />);

  await user.click(screen.getByTestId('delete-4f08ce3f-a0de-43c6-8ccc-9fe93822ed18'));

  expect(screen.getByTestId('file-list').childElementCount).toBe(1);
  expect(screen.queryByText('TestFile1.pdf')).not.toBeInTheDocument();
});

import { removeDuplicateAttachments } from '../../common/components/fileUpload/utils';
import { ApplicationAttachmentMetadata } from './types/application';

const attachments: ApplicationAttachmentMetadata[] = [
  {
    id: '5842de6c-9521-4053-92b7-ae1370ab7e93',
    fileName: 'Haitaton_liite.png',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-08-15T08:40:05.948818Z',
    applicationId: 1,
    attachmentType: 'MUU',
  },
  {
    id: '4a61945e-a43f-4ee5-8239-1329b4809954',
    fileName: 'Haitaton_liite_2.txt',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-08-15T08:40:06.004338Z',
    applicationId: 1,
    attachmentType: 'MUU',
  },
  {
    id: 'cfeba660-d415-4557-84f9-818eb64a3483',
    fileName: 'Haitaton_liite_3.jpg',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-08-15T12:32:17.923746Z',
    applicationId: 1,
    attachmentType: 'MUU',
  },
  {
    id: '58584665-5ed3-478b-95ab-c140c52e3408',
    fileName: 'Haitaton_liite_4.pdf',
    createdByUserId: 'b9a58f4c-f5fe-11ec-997f-0a580a800284',
    createdAt: '2023-08-15T12:32:32.746984Z',
    applicationId: 1,
    attachmentType: 'MUU',
  },
];

test('Should filter out existing attachments', () => {
  const files = [
    new File([''], 'Haitaton_liite.png'),
    new File([''], 'Haitaton_liite_2.txt'),
    new File([''], 'Haitaton_liite_uusi.pdf'),
    new File([''], 'Haitaton_liite_3.jpg'),
    new File([''], 'Haitaton_liite_uusi_2.jpg'),
    new File([''], 'Haitaton_liite_4.pdf'),
  ];

  expect(removeDuplicateAttachments(files, attachments)).toMatchObject([
    [{ name: 'Haitaton_liite_uusi.pdf' }, { name: 'Haitaton_liite_uusi_2.jpg' }],
    [
      { name: 'Haitaton_liite.png' },
      { name: 'Haitaton_liite_2.txt' },
      { name: 'Haitaton_liite_3.jpg' },
      { name: 'Haitaton_liite_4.pdf' },
    ],
  ]);
});

test('Should not filter out anything from only new files', () => {
  const files = [
    new File([''], 'Haitaton_liite_uusi.pdf'),
    new File([''], 'Haitaton_liite_uusi_2.jpg'),
    new File([''], 'Haitaton_liite_uusi_3.jpg'),
  ];

  expect(removeDuplicateAttachments(files, attachments)).toMatchObject([
    [
      { name: 'Haitaton_liite_uusi.pdf' },
      { name: 'Haitaton_liite_uusi_2.jpg' },
      { name: 'Haitaton_liite_uusi_3.jpg' },
    ],
    [],
  ]);

  expect(removeDuplicateAttachments(files, [])).toMatchObject([
    [
      { name: 'Haitaton_liite_uusi.pdf' },
      { name: 'Haitaton_liite_uusi_2.jpg' },
      { name: 'Haitaton_liite_uusi_3.jpg' },
    ],
    [],
  ]);
});

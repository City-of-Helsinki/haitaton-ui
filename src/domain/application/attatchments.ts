import api from '../api/api';

export async function saveAttachments(files: File[]) {
  const response = await api.post('/attachments', files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getAttachments() {
  const response = await api.get('/attachments');
  return response.data;
}

export async function deleteAttachment(uid: number) {
  const response = await api.delete(`/attachments/${uid}`);
  return response.data;
}

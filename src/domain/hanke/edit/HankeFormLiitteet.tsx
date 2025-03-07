import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import Text from '../../../common/components/text/Text';
import FileUpload from '../../../common/components/fileUpload/FileUpload';
import { HANKE_ATTACHMENTS_QUERY_KEY } from '../hankeAttachments/constants';
import { useFormContext } from 'react-hook-form';
import { HankeDataFormState } from './types';
import useHankeAttachments from '../hankeAttachments/useHankeAttachments';
import {
  deleteAttachment,
  getAttachmentFile,
  uploadAttachment,
} from '../hankeAttachments/hankeAttachmentsApi';
import { AttachmentMetadata } from '../../../common/types/attachment';

function HankeFormLiitteet() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getValues } = useFormContext<HankeDataFormState>();
  const hankeTunnus = getValues('hankeTunnus');
  const { data: existingAttachments, isError: attachmentsLoadError } =
    useHankeAttachments(hankeTunnus);

  function uploadAttachmentFunction({
    file,
    abortSignal,
  }: {
    file: File;
    abortSignal?: AbortSignal;
  }) {
    return uploadAttachment({
      hankeTunnus: hankeTunnus!,
      file,
      abortSignal,
    });
  }

  function handleUpload(uploading: boolean) {
    if (!uploading) {
      queryClient.invalidateQueries(HANKE_ATTACHMENTS_QUERY_KEY);
    }
  }

  function downloadFile(file: AttachmentMetadata) {
    return getAttachmentFile(hankeTunnus!, file.id);
  }

  function deleteFile(file: AttachmentMetadata) {
    return deleteAttachment({ hankeTunnus: hankeTunnus!, attachmentId: file.id });
  }

  function handleFileDelete() {
    queryClient.invalidateQueries(HANKE_ATTACHMENTS_QUERY_KEY);
  }

  return (
    <div>
      <Text tag="p" spacingBottom="l">
        {t('hankeForm:hankkeenLiitteetForm:instructions')}
      </Text>

      <FileUpload
        id="hanke-file-upload"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments}
        existingAttachmentsLoadError={attachmentsLoadError}
        uploadFunction={uploadAttachmentFunction}
        onUpload={handleUpload}
        fileDownLoadFunction={downloadFile}
        fileDeleteFunction={deleteFile}
        onFileDelete={handleFileDelete}
      />
    </div>
  );
}

export default HankeFormLiitteet;

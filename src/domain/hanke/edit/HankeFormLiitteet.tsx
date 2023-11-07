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

type Props = {
  onFileUpload: (uploading: boolean) => void;
};

function HankeFormLiitteet({ onFileUpload }: Readonly<Props>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getValues } = useFormContext<HankeDataFormState>();
  const hankeTunnus = getValues('hankeTunnus');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: existingAttachments, isError: attachmentsLoadError } =
    useHankeAttachments(hankeTunnus);

  function handleUpload(uploading: boolean) {
    onFileUpload(uploading);
    if (!uploading) {
      queryClient.invalidateQueries(HANKE_ATTACHMENTS_QUERY_KEY);
    }
  }

  return (
    <div>
      <Text tag="p" spacingBottom="l">
        {t('hankeForm:hankkeenLiitteetForm:instructions')}
      </Text>

      <FileUpload
        id="hanke-file-upload"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            hankeTunnus,
            file,
            abortSignal,
          })
        }
        onUpload={handleUpload}
        fileDownLoadFunction={(file) => getAttachmentFile(hankeTunnus!, file.id)}
        fileDeleteFunction={(file) =>
          deleteAttachment({ hankeTunnus: hankeTunnus!, attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries(HANKE_ATTACHMENTS_QUERY_KEY)}
      />
    </div>
  );
}

export default HankeFormLiitteet;

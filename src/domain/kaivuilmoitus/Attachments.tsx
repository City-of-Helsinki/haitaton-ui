import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { deleteAttachment, getAttachmentFile, uploadAttachment } from '../application/attachments';
import { KaivuilmoitusFormValues } from './types';
import FileUpload from '../../common/components/fileUpload/FileUpload';
import styles from './BasicInfo.module.scss';
import { Link, Notification } from 'hds-react';
import TextArea from '../../common/components/textArea/TextArea';

type Props = {
  existingAttachments: ApplicationAttachmentMetadata[] | undefined;
  attachmentsLoadError: boolean;
  onFileUpload: (isUploading: boolean) => void;
};

function Attachments({ existingAttachments, attachmentsLoadError, onFileUpload }: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<KaivuilmoitusFormValues>();
  const alluStatus = getValues('alluStatus');

  function handleFileUpload(uploading: boolean) {
    onFileUpload(uploading);
    if (!uploading) {
      queryClient.invalidateQueries('attachments');
    }
  }

  const showDeleteButton = useCallback(() => {
    return alluStatus === null;
  }, [alluStatus]);

  return (
    <div>
      <div className={styles.formInstructions}>
        <Trans
          i18nKey="kaivuilmoitusForm:liitteetJaLisatiedot:instructions"
          components={{
            a: (
              <Link
                href="https://www.hel.fi/static/hkr/luvat/tyyppikuvat/Tyyppikuvat.pdf"
                openInNewTab
              >
                Helsingin kaupungin tyyppikuvat
              </Link>
            ),
          }}
        ></Trans>
      </div>

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:trafficArrangementPlan')}
      </Box>
      <FileUpload
        id="excavation-notification-file-upload-traffic-arrangement-plan"
        accept=".pdf"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments?.filter(
          (metadata) => metadata.attachmentType === 'LIIKENNEJARJESTELY',
        )}
        existingAttachmentsLoadError={attachmentsLoadError}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            applicationId: getValues('id')!,
            attachmentType: 'LIIKENNEJARJESTELY',
            file,
            abortSignal,
          })
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={(file) => getAttachmentFile(getValues('id')!, file.id)}
        fileDeleteFunction={(file) =>
          deleteAttachment({ applicationId: getValues('id'), attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries('attachments')}
        showDeleteButtonForFile={showDeleteButton}
      />

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:mandate')}
      </Box>
      <Notification
        size="small"
        type="info"
        label="Mandate info"
        style={{ marginTop: 'var(--spacing-s)', marginBottom: 'var(--spacing-s)' }}
      >
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:mandateInfo')}
      </Notification>
      <FileUpload
        id="excavation-notification-file-upload-mandate"
        accept=".pdf"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments?.filter(
          (metadata) => metadata.attachmentType === 'VALTAKIRJA',
        )}
        existingAttachmentsLoadError={attachmentsLoadError}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            applicationId: getValues('id')!,
            attachmentType: 'VALTAKIRJA',
            file,
            abortSignal,
          })
        }
        onUpload={handleFileUpload}
        fileDeleteFunction={(file) =>
          deleteAttachment({ applicationId: getValues('id'), attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries('attachments')}
        showDeleteButtonForFile={showDeleteButton}
      />

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:otherAttachments')}
      </Box>
      <FileUpload
        id="excavation-notification-file-upload-other-attachments"
        accept=".pdf,.jpg,.jpeg,.png,.dgn,.dwg,.docx,.txt,.gt"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={existingAttachments?.filter(
          (metadata) => metadata.attachmentType === 'MUU',
        )}
        existingAttachmentsLoadError={attachmentsLoadError}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            applicationId: getValues('id')!,
            attachmentType: 'MUU',
            file,
            abortSignal,
          })
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={(file) => getAttachmentFile(getValues('id')!, file.id)}
        fileDeleteFunction={(file) =>
          deleteAttachment({ applicationId: getValues('id'), attachmentId: file?.id })
        }
        onFileDelete={() => queryClient.invalidateQueries('attachments')}
        showDeleteButtonForFile={showDeleteButton}
      />

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:additionalInformation')}
      </Box>
      <TextArea
        className={styles.formRow}
        name="applicationData.additionalInfo"
        label={t('hakemus:labels:additionalInformation')}
        maxLength={2000}
      />
    </div>
  );
}

export default Attachments;

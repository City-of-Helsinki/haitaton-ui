import { Trans, useTranslation } from 'react-i18next';
import { Link, Notification, NotificationSize } from 'hds-react';
import { Box, Flex } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import FileUpload from '../../../../common/components/fileUpload/FileUpload';
import { getAttachmentFile as getApplicationAttachmentFile } from '../../../application/attachments';
import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { ApplicationAttachmentMetadata, AttachmentType } from '../../types/application';
import { MuutosilmoitusAttachmentMetadata } from '../../muutosilmoitus/types';
import TextArea from '../../../../common/components/textArea/TextArea';
import { AttachmentMetadata } from '../../../../common/types/attachment';
import { KaivuilmoitusMuutosilmoitusFormValues } from '../../../kaivuilmoitusMuutosilmoitus/types';
import { KaivuilmoitusTaydennysFormValues } from '../../../kaivuilmoitusTaydennys/types';
import { TaydennysAttachmentMetadata } from '../../taydennys/types';

type AttachmentAPI = {
  uploadAttachment: (
    id: string,
    attachmentType: AttachmentType,
    file: File,
    abortSignal?: AbortSignal,
  ) => Promise<TaydennysAttachmentMetadata | MuutosilmoitusAttachmentMetadata>;
  deleteAttachment: (id: string | null, attachmentId: string | undefined) => Promise<void>;
  downloadAttachment: (id: string, attachmentId: string) => Promise<string>;
};

type Props = {
  applicationId: number;
  attachments: TaydennysAttachmentMetadata[] | MuutosilmoitusAttachmentMetadata[];
  originalAttachments?: ApplicationAttachmentMetadata[];
  api: AttachmentAPI;
};

export default function Attachments({
  applicationId,
  attachments,
  originalAttachments,
  api,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<
    KaivuilmoitusTaydennysFormValues | KaivuilmoitusMuutosilmoitusFormValues
  >();
  const originalTrafficArrangementPlans = originalAttachments?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const originalMandates = originalAttachments?.filter(
    (attachment) => attachment.attachmentType === 'VALTAKIRJA',
  );
  const originalOtherAttachments = originalAttachments?.filter(
    (attachment) => attachment.attachmentType === 'MUU',
  );

  function downloadOriginalAttachment(file: ApplicationAttachmentMetadata) {
    return getApplicationAttachmentFile(applicationId, file.id);
  }

  function handleFileUpload(uploading: boolean) {
    if (!uploading) {
      queryClient.invalidateQueries(['application', applicationId]).then(() => {});
    }
  }

  function downloadAttachment(file: AttachmentMetadata) {
    return api.downloadAttachment(getValues('id'), file.id);
  }

  function deleteFile(file: AttachmentMetadata) {
    return api.deleteAttachment(getValues('id'), file?.id);
  }

  function handleFileDelete() {
    queryClient.invalidateQueries(['application', applicationId]).then(() => {});
  }

  return (
    <Box mb="var(--spacing-l)">
      <Flex direction="column" gap="var(--spacing-m)" mb="var(--spacing-m)">
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
        />
      </Flex>

      {originalAttachments && originalAttachments.length > 0 && (
        <FormSummarySection>
          <SectionItemTitle>
            {t('kaivuilmoitusForm:liitteetJaLisatiedot:originalTrafficArrangementPlan')}
          </SectionItemTitle>
          <SectionItemContent>
            {originalTrafficArrangementPlans && originalTrafficArrangementPlans.length > 0 && (
              <FileDownloadList
                files={originalTrafficArrangementPlans}
                download={downloadOriginalAttachment}
              />
            )}
          </SectionItemContent>
          <SectionItemTitle>
            {t('kaivuilmoitusForm:liitteetJaLisatiedot:originalMandate')}
          </SectionItemTitle>
          <SectionItemContent>
            {originalMandates && originalMandates.length > 0 && (
              <FileDownloadList files={originalMandates} />
            )}
          </SectionItemContent>
          <SectionItemTitle>
            {t('kaivuilmoitusForm:liitteetJaLisatiedot:originalOtherAttachments')}
          </SectionItemTitle>
          <SectionItemContent>
            {originalOtherAttachments && originalOtherAttachments.length > 0 && (
              <FileDownloadList
                files={originalOtherAttachments}
                download={downloadOriginalAttachment}
              />
            )}
          </SectionItemContent>
        </FormSummarySection>
      )}

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:trafficArrangementPlan')}
      </Box>
      <FileUpload
        id="excavation-notification-file-upload-traffic-arrangement-plan"
        accept=".pdf"
        maxSize={104857600}
        dragAndDrop
        multiple
        existingAttachments={attachments?.filter(
          (metadata) => metadata.attachmentType === 'LIIKENNEJARJESTELY',
        )}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          api.uploadAttachment(getValues('id'), 'LIIKENNEJARJESTELY', file, abortSignal)
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={downloadAttachment}
        fileDeleteFunction={deleteFile}
        onFileDelete={handleFileDelete}
      />

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:mandate')}
      </Box>
      <Notification
        size={NotificationSize.Small}
        type="info"
        label={t('kaivuilmoitusForm:liitteetJaLisatiedot:mandateCheck')}
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
        existingAttachments={attachments?.filter(
          (metadata) => metadata.attachmentType === 'VALTAKIRJA',
        )}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          api.uploadAttachment(getValues('id'), 'VALTAKIRJA', file, abortSignal)
        }
        onUpload={handleFileUpload}
        fileDeleteFunction={deleteFile}
        onFileDelete={handleFileDelete}
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
        existingAttachments={attachments?.filter((metadata) => metadata.attachmentType === 'MUU')}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          api.uploadAttachment(getValues('id'), 'MUU', file, abortSignal)
        }
        onUpload={handleFileUpload}
        fileDownLoadFunction={downloadAttachment}
        fileDeleteFunction={deleteFile}
        onFileDelete={handleFileDelete}
      />

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:additionalInformation')}
      </Box>
      <TextArea
        name="applicationData.additionalInfo"
        label={t('hakemus:labels:additionalInformation')}
        maxLength={2000}
      />
    </Box>
  );
}

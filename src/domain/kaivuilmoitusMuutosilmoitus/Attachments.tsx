import { Trans, useTranslation } from 'react-i18next';
import { Link, Notification } from 'hds-react';
import { Box, Flex } from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { useFormContext } from 'react-hook-form';
import FileUpload from '../../common/components/fileUpload/FileUpload';
import {
  deleteAttachment,
  getAttachmentFile,
  uploadAttachment,
} from '../application/muutosilmoitus/muutosilmoitusAttachmentsApi';
import { getAttachmentFile as getApplicationAttachmentFile } from '../application/attachments';
import FileDownloadList from '../../common/components/fileDownloadList/FileDownloadList';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../forms/components/FormSummarySection';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import { MuutosilmoitusAttachmentMetadata } from '../application/muutosilmoitus/types';
import { KaivuilmoitusMuutosilmoitusFormValues } from './types';
import TextArea from '../../common/components/textArea/TextArea';
import { AttachmentMetadata } from '../../common/types/attachment';

type Props = {
  applicationId: number;
  muutosilmoitusAttachments: MuutosilmoitusAttachmentMetadata[];
  originalAttachments?: ApplicationAttachmentMetadata[];
};

export default function Attachments({
  applicationId,
  muutosilmoitusAttachments,
  originalAttachments,
}: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { getValues } = useFormContext<KaivuilmoitusMuutosilmoitusFormValues>();
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
    return getAttachmentFile(getValues('id'), file.id);
  }

  function deleteFile(file: AttachmentMetadata) {
    return deleteAttachment({ muutosilmoitusId: getValues('id'), attachmentId: file?.id });
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
        existingAttachments={muutosilmoitusAttachments?.filter(
          (metadata) => metadata.attachmentType === 'LIIKENNEJARJESTELY',
        )}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            muutosilmoitusId: getValues('id'),
            attachmentType: 'LIIKENNEJARJESTELY',
            file,
            abortSignal,
          })
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
        size="small"
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
        existingAttachments={muutosilmoitusAttachments?.filter(
          (metadata) => metadata.attachmentType === 'VALTAKIRJA',
        )}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            muutosilmoitusId: getValues('id'),
            attachmentType: 'VALTAKIRJA',
            file,
            abortSignal,
          })
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
        existingAttachments={muutosilmoitusAttachments?.filter(
          (metadata) => metadata.attachmentType === 'MUU',
        )}
        maxFilesNumber={20}
        uploadFunction={({ file, abortSignal }) =>
          uploadAttachment({
            muutosilmoitusId: getValues('id'),
            attachmentType: 'MUU',
            file,
            abortSignal,
          })
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

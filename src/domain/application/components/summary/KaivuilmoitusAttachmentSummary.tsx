import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../../types/application';
import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { getAttachmentFile } from '../../attachments';

type Props = {
  formData: Application<KaivuilmoitusData>;
  attachments: ApplicationAttachmentMetadata[] | undefined;
};

function AttachmentSummary({ formData, attachments }: Props) {
  const { t } = useTranslation();

  const { additionalInfo } = formData.applicationData;

  const download = (file: ApplicationAttachmentMetadata) =>
    getAttachmentFile(file.applicationId, file.id);

  const trafficArrangementPlans = attachments?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const mandates = attachments?.filter((attachment) => attachment.attachmentType === 'VALTAKIRJA');
  const otherAttachments = attachments?.filter((attachment) => attachment.attachmentType === 'MUU');

  return (
    <FormSummarySection>
      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:trafficArrangementPlan')}
      </SectionItemTitle>
      <SectionItemContent>
        {trafficArrangementPlans && trafficArrangementPlans.length > 0 && (
          <FileDownloadList files={trafficArrangementPlans} download={download} />
        )}
      </SectionItemContent>

      <SectionItemTitle>{t('kaivuilmoitusForm:liitteetJaLisatiedot:mandate')}</SectionItemTitle>
      <SectionItemContent>
        {mandates && mandates.length > 0 && <FileDownloadList files={mandates} />}
      </SectionItemContent>

      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:otherAttachments')}
      </SectionItemTitle>
      <SectionItemContent>
        {otherAttachments && otherAttachments.length > 0 && (
          <FileDownloadList files={otherAttachments} download={download} />
        )}
      </SectionItemContent>

      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:additionalInformation')}
      </SectionItemTitle>
      <SectionItemContent>
        <p>{additionalInfo}</p>
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;

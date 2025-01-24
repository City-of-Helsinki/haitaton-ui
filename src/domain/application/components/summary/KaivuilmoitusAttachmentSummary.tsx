import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentAdded,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../../types/application';
import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { getAttachmentFile } from '../../attachments';
import { TaydennysAttachmentMetadata } from '../../taydennys/types';
import TaydennysAttachmentsList from '../../taydennys/components/TaydennysAttachmentsList';

type Props = {
  formData: Application<KaivuilmoitusData>;
  attachments: ApplicationAttachmentMetadata[] | undefined;
  taydennysAttachments?: TaydennysAttachmentMetadata[];
  taydennysAdditionalInfo?: string | null;
};

function AttachmentSummary({
  formData,
  attachments,
  taydennysAttachments,
  taydennysAdditionalInfo,
}: Props) {
  const { t } = useTranslation();

  const { additionalInfo } = formData.applicationData;

  const download = (file: ApplicationAttachmentMetadata) =>
    getAttachmentFile(file.applicationId, file.id);

  const trafficArrangementPlans = attachments?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const mandates = attachments?.filter((attachment) => attachment.attachmentType === 'VALTAKIRJA');
  const otherAttachments = attachments?.filter((attachment) => attachment.attachmentType === 'MUU');
  const taydennysTrafficArrangementPlans = taydennysAttachments?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const taydennysMandates = taydennysAttachments?.filter(
    (attachment) => attachment.attachmentType === 'VALTAKIRJA',
  );
  const taydennysOtherAttachments = taydennysAttachments?.filter(
    (attachment) => attachment.attachmentType === 'MUU',
  );

  return (
    <FormSummarySection>
      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:trafficArrangementPlan')}
      </SectionItemTitle>
      <SectionItemContent>
        {trafficArrangementPlans && trafficArrangementPlans.length > 0 && (
          <FileDownloadList files={trafficArrangementPlans} download={download} />
        )}
        {taydennysTrafficArrangementPlans && taydennysTrafficArrangementPlans.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <TaydennysAttachmentsList attachments={taydennysTrafficArrangementPlans} />
          </SectionItemContentAdded>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('kaivuilmoitusForm:liitteetJaLisatiedot:mandate')}</SectionItemTitle>
      <SectionItemContent>
        {mandates && mandates.length > 0 && <FileDownloadList files={mandates} />}
        {taydennysMandates && taydennysMandates.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <TaydennysAttachmentsList attachments={taydennysMandates} />
          </SectionItemContentAdded>
        )}
      </SectionItemContent>
      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:otherAttachments')}
      </SectionItemTitle>
      <SectionItemContent>
        {otherAttachments && otherAttachments.length > 0 && (
          <FileDownloadList files={otherAttachments} download={download} />
        )}
        {taydennysOtherAttachments && taydennysOtherAttachments.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <TaydennysAttachmentsList attachments={taydennysOtherAttachments} />
          </SectionItemContentAdded>
        )}
      </SectionItemContent>

      <SectionItemTitle>
        {t('kaivuilmoitusForm:liitteetJaLisatiedot:additionalInformation')}
      </SectionItemTitle>
      <SectionItemContent>
        <p>{additionalInfo}</p>
        {taydennysAdditionalInfo && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <p>{taydennysAdditionalInfo}</p>
          </SectionItemContentAdded>
        )}
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;

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
import { MuutosilmoitusAttachmentMetadata } from '../../muutosilmoitus/types';
import MuutosilmoitusAttachmentsList from '../../muutosilmoitus/components/MuutosilmoitusAttachmentsList';

type Props = {
  formData: Application<KaivuilmoitusData>;
  attachments: ApplicationAttachmentMetadata[] | undefined;
  taydennysAttachments?: TaydennysAttachmentMetadata[];
  taydennysAdditionalInfo?: string | null;
  muutosilmoitusAttachments?: MuutosilmoitusAttachmentMetadata[];
  muutosilmoitusAdditionalInfo?: string | null;
};

function AttachmentSummary({
  formData,
  attachments,
  taydennysAttachments,
  taydennysAdditionalInfo,
  muutosilmoitusAttachments,
  muutosilmoitusAdditionalInfo,
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
  const muutosilmoitusTrafficArrangementPlans = muutosilmoitusAttachments?.filter(
    (attachment) => attachment.attachmentType === 'LIIKENNEJARJESTELY',
  );
  const muutosilmoitusMandates = muutosilmoitusAttachments?.filter(
    (attachment) => attachment.attachmentType === 'VALTAKIRJA',
  );
  const muutosilmoitusOtherAttachments = muutosilmoitusAttachments?.filter(
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
        {muutosilmoitusTrafficArrangementPlans &&
          muutosilmoitusTrafficArrangementPlans.length > 0 && (
            <SectionItemContentAdded mt="var(--spacing-xs)">
              <MuutosilmoitusAttachmentsList attachments={muutosilmoitusTrafficArrangementPlans} />
            </SectionItemContentAdded>
          )}
      </SectionItemContent>
      <SectionItemTitle>{t('kaivuilmoitusForm:liitteetJaLisatiedot:mandate')}</SectionItemTitle>
      <SectionItemContent>
        {mandates && mandates.length > 0 && <FileDownloadList files={mandates} />}
        {taydennysMandates && taydennysMandates.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <TaydennysAttachmentsList attachments={taydennysMandates} allowDownload={false} />
          </SectionItemContentAdded>
        )}
        {muutosilmoitusMandates && muutosilmoitusMandates.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <MuutosilmoitusAttachmentsList
              attachments={muutosilmoitusMandates}
              allowDownload={false}
            />
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
        {muutosilmoitusOtherAttachments && muutosilmoitusOtherAttachments.length > 0 && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <MuutosilmoitusAttachmentsList attachments={muutosilmoitusOtherAttachments} />
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
        {muutosilmoitusAdditionalInfo && (
          <SectionItemContentAdded mt="var(--spacing-xs)">
            <p>{muutosilmoitusAdditionalInfo}</p>
          </SectionItemContentAdded>
        )}
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;

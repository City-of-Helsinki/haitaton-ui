import { useTranslation } from 'react-i18next';
import { FormSummarySection, SectionTitle } from '../../forms/components/FormSummarySection';
import BasicInformationSummary from '../../application/components/summary/KaivuilmoitusBasicInformationSummary';
import ContactsSummary from '../../application/components/summary/ContactsSummary';
import InvoicingCustomerSummary from '../../application/components/summary/InvoicingCustomerSummary';
import AttachmentSummary from '../../application/components/summary/KaivuilmoitusAttachmentSummary';
import AreaSummary from './AreaSummary';
import HaittojenhallintaSummary from './HaittojenhallintaSummary';
import { HankeAlue } from '../../types/hanke';
import {
  Application,
  ApplicationAttachmentMetadata,
  KaivuilmoitusData,
} from '../../application/types/application';

type Props = {
  application: Application<KaivuilmoitusData>;
  attachments: ApplicationAttachmentMetadata[];
  hankealueet: HankeAlue[];
};

export default function KaivuilmoitusSummary({
  application,
  attachments,
  hankealueet,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <>
      <SectionTitle>{t('form:headers:perustiedot')}</SectionTitle>
      <BasicInformationSummary formData={application} />

      <SectionTitle>{t('form:labels:areas')}</SectionTitle>
      <AreaSummary formData={application} />

      <SectionTitle>{t('hankePortfolio:tabit:haittojenHallinta')}</SectionTitle>
      <HaittojenhallintaSummary hankealueet={hankealueet} formData={application} />

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        <ContactsSummary
          customerWithContacts={application.applicationData.customerWithContacts}
          title={t('form:yhteystiedot:titles:customerWithContacts')}
        />
        <ContactsSummary
          customerWithContacts={application.applicationData.contractorWithContacts}
          title={t('form:yhteystiedot:titles:contractorWithContacts')}
        />
        <ContactsSummary
          customerWithContacts={application.applicationData.propertyDeveloperWithContacts}
          title={t('form:yhteystiedot:titles:rakennuttajat')}
        />
        <ContactsSummary
          customerWithContacts={application.applicationData.representativeWithContacts}
          title={t('form:yhteystiedot:titles:representativeWithContacts')}
        />
        <InvoicingCustomerSummary
          invoicingCustomer={application.applicationData.invoicingCustomer}
          title={t('form:yhteystiedot:titles:invoicingCustomerInfo')}
        />
      </FormSummarySection>

      <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
      <AttachmentSummary formData={application} attachments={attachments} />
    </>
  );
}

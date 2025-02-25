import { useTranslation } from 'react-i18next';
import { JohtoselvitysData, KaivuilmoitusData } from '../../../types/application';
import {
  FormSummarySection,
  SectionItemContentRemoved,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import ContactsSummary from '../../../components/summary/ContactsSummary';
import InvoicingCustomerSummary from '../../../components/summary/InvoicingCustomerSummary';

type Props = {
  data: JohtoselvitysData | KaivuilmoitusData;
  originalData: JohtoselvitysData | KaivuilmoitusData;
  muutokset: string[];
};

export default function TaydennysContactsSummary({
  data,
  originalData,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const {
    customerWithContacts,
    contractorWithContacts,
    propertyDeveloperWithContacts,
    representativeWithContacts,
  } = data;
  const invoicingCustomer = (data as KaivuilmoitusData).invoicingCustomer;

  const customerWithContactsChanged = muutokset.includes('customerWithContacts');
  const contractorWithContactsChanged = muutokset.includes('contractorWithContacts');
  const propertyDeveloperWithContactsChanged = muutokset.includes('propertyDeveloperWithContacts');
  const representativeWithContactsChanged = muutokset.includes('representativeWithContacts');
  const invoicingCustomerChanged = muutokset.includes('invoicingCustomer');

  if (
    !customerWithContactsChanged &&
    !contractorWithContactsChanged &&
    !propertyDeveloperWithContactsChanged &&
    !representativeWithContactsChanged &&
    !invoicingCustomerChanged
  ) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        {customerWithContactsChanged && (
          <ContactsSummary
            customerWithContacts={customerWithContacts}
            title={t('form:yhteystiedot:titles:customerWithContacts')}
          />
        )}
        {contractorWithContactsChanged && (
          <ContactsSummary
            customerWithContacts={contractorWithContacts}
            title={t('form:yhteystiedot:titles:contractorWithContacts')}
          />
        )}
        {propertyDeveloperWithContactsChanged && (
          <ContactsSummary
            customerWithContacts={
              propertyDeveloperWithContacts ?? originalData.propertyDeveloperWithContacts
            }
            title={t('form:yhteystiedot:titles:rakennuttajat')}
            ContentContainer={
              !propertyDeveloperWithContacts ? SectionItemContentRemoved : undefined
            }
          />
        )}
        {representativeWithContactsChanged && (
          <ContactsSummary
            customerWithContacts={
              representativeWithContacts ?? originalData.representativeWithContacts
            }
            title={t('form:yhteystiedot:titles:representativeWithContacts')}
            ContentContainer={!representativeWithContacts ? SectionItemContentRemoved : undefined}
          />
        )}
        {invoicingCustomerChanged && (
          <InvoicingCustomerSummary
            invoicingCustomer={invoicingCustomer}
            title={t('form:yhteystiedot:titles:invoicingCustomerInfo')}
          />
        )}
      </FormSummarySection>
    </>
  );
}

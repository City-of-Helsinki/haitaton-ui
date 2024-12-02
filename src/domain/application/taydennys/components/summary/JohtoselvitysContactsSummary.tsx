import { useTranslation } from 'react-i18next';
import { JohtoselvitysData } from '../../../types/application';
import {
  FormSummarySection,
  SectionItemContentRemoved,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import ContactsSummary from '../../../components/summary/ContactsSummary';

type Props = {
  data: JohtoselvitysData;
  originalData: JohtoselvitysData;
  muutokset: string[];
};

export default function JohtoselvitysContactsSummary({
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
  const customerWithContactsChanged = muutokset.includes('customerWithContacts');
  const contractorWithContactsChanged = muutokset.includes('contractorWithContacts');
  const propertyDeveloperWithContactsChanged = muutokset.includes('propertyDeveloperWithContacts');
  const representativeWithContactsChanged = muutokset.includes('representativeWithContacts');

  if (
    !customerWithContactsChanged &&
    !contractorWithContactsChanged &&
    !propertyDeveloperWithContactsChanged &&
    !representativeWithContactsChanged
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
      </FormSummarySection>
    </>
  );
}

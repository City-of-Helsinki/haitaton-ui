import React from 'react';
import { Select } from 'hds-react';
import { useTranslation } from 'react-i18next';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import { ContactType, Customer } from '../types/application';
import {
  CONTACT_TYYPPI,
  HankeYhteystieto,
  HankeContacts,
  HankeMuuTaho,
  isHankeContact,
} from '../../types/hanke';

type PreFilledContactOption = {
  label: string;
  value: HankeYhteystieto | HankeMuuTaho;
};

const PreFilledContactSelect: React.FC<{
  allHankeContacts: HankeContacts;
  onChange: (customer: Customer) => void;
}> = ({ allHankeContacts, onChange }) => {
  const { t } = useTranslation();

  const preFilledContactOptions: PreFilledContactOption[] = allHankeContacts.flatMap(
    (hankeContacts) =>
      hankeContacts
        ? hankeContacts.map((contact) => ({ label: contact.nimi, value: contact }))
        : [],
  );

  function handlePreFilledContactChange(option: PreFilledContactOption | undefined) {
    function mapType(type: keyof typeof CONTACT_TYYPPI | null): keyof typeof ContactType | null {
      if (type === 'YKSITYISHENKILO') return 'PERSON';
      if (type === 'YRITYS') return 'COMPANY';
      return null;
    }

    if (option) {
      const { value } = option;

      const customer: Customer = {
        type: (isHankeContact(value) && mapType(value.tyyppi)) || null,
        name: value.nimi,
        country: 'FI',
        email: value.email,
        phone: value.puhelinnumero || '',
        registryKey: (isHankeContact(value) && value.ytunnus) || null,
        registryKeyHidden: false,
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      };

      onChange(customer);
    }
  }

  if (preFilledContactOptions.length === 0) {
    return null;
  }

  return (
    <ResponsiveGrid>
      <Select<PreFilledContactOption>
        options={preFilledContactOptions}
        id="roleInApplication"
        label={t('hakemus:labels:preFilledInfo')}
        onChange={handlePreFilledContactChange}
        helper={t('hakemus:labels:preFilledInfoHelp')}
      />
    </ResponsiveGrid>
  );
};

export default PreFilledContactSelect;

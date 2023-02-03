import React from 'react';
import { Select } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import { ContactType, Customer, CustomerType } from '../../johtoselvitys/types';
import {
  CONTACT_TYYPPI,
  HankeContact,
  HankeContacts,
  HankeMuuTaho,
  isHankeContact,
} from '../../types/hanke';

type PreFilledContactOption = {
  label: string;
  value: HankeContact | HankeMuuTaho;
};

const PreFilledContactSelect: React.FC<{
  customerType: CustomerType;
  allHankeContacts: HankeContacts;
}> = ({ customerType, allHankeContacts }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();

  const preFilledContactOptions: (
    | PreFilledContactOption
    | undefined
  )[] = allHankeContacts.flatMap((hankeContacts) =>
    hankeContacts?.map((contact) => ({ label: contact.nimi, value: contact }))
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
        postalAddress: {
          streetAddress: {
            streetName: (isHankeContact(value) && value.osoite) || '',
          },
          postalCode: (isHankeContact(value) && value.postinumero) || '',
          city: (isHankeContact(value) && value.postitoimipaikka) || '',
        },
        email: value.email,
        phone: value.puhelinnumero || '',
        registryKey: (isHankeContact(value) && value.ytunnusTaiHetu) || '',
        ovt: null,
        invoicingOperator: null,
        sapCustomerNumber: null,
      };

      setValue(`applicationData.${customerType}.customer`, customer);
    }
  }

  return (
    <ResponsiveGrid>
      <Select
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

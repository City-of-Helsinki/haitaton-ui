import React, { useEffect } from 'react';
import { Accordion, Button, Fieldset, IconPlusCircle } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  ContactType,
  CustomerType,
  Contact as ApplicationContact,
  CustomerWithContacts,
} from '../application/types/application';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import TextInput from '../../common/components/textInput/TextInput';
import useLocale from '../../common/hooks/useLocale';
import Dropdown from '../../common/components/dropdown/Dropdown';
import { JohtoselvitysFormValues } from './types';
import FormContact from '../forms/components/FormContact';

function getEmptyContact(): ApplicationContact {
  return {
    firstName: '',
    lastName: '',
    orderer: false,
    email: '',
    phone: '',
  };
}

function getEmptyCustomerWithContacts(): CustomerWithContacts {
  return {
    customer: {
      type: null,
      name: '',
      country: 'FI',
      email: '',
      phone: '',
      registryKey: null,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [getEmptyContact()],
  };
}

const CustomerFields: React.FC<{
  customerType: CustomerType;
}> = ({ customerType }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<JohtoselvitysFormValues>();

  const [selectedContactType, registryKey] = watch([
    `applicationData.${customerType}.customer.type`,
    `applicationData.${customerType}.customer.registryKey`,
  ]);

  useEffect(() => {
    // If setting contact type to other than company or association, set null to registry key
    if (selectedContactType === 'PERSON' || selectedContactType === 'OTHER') {
      setValue(`applicationData.${customerType}.customer.registryKey`, null, {
        shouldValidate: true,
      });
    }
  }, [selectedContactType, customerType, setValue]);

  useEffect(() => {
    // When emptying registry key field, set its value to null
    if (registryKey === '') {
      setValue(`applicationData.${customerType}.customer.registryKey`, null, {
        shouldValidate: true,
      });
    }
  }, [registryKey, customerType, setValue]);

  return (
    <Fieldset
      heading={t(`form:yhteystiedot:titles:${customerType}`)}
      style={{ paddingTop: 'var(--spacing-s)' }}
    >
      <ResponsiveGrid>
        <Dropdown
          id={`applicationData.${customerType}.customer.type`}
          name={`applicationData.${customerType}.customer.type`}
          required
          defaultValue={null}
          label={t('form:yhteystiedot:labels:tyyppi')}
          options={$enum(ContactType).map((value) => {
            return {
              value,
              label: t(`form:yhteystiedot:contactType:${value}`),
            };
          })}
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.customer.name`}
          label={t('form:yhteystiedot:labels:nimi')}
          required
          autoComplete={selectedContactType === 'PERSON' ? 'name' : 'organization'}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.registryKey`}
          label={t('form:yhteystiedot:labels:ytunnus')}
          disabled={selectedContactType === 'PERSON' || selectedContactType === 'OTHER'}
          autoComplete="on"
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.customer.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
          autoComplete="email"
        />
        <TextInput
          name={`applicationData.${customerType}.customer.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
          autoComplete="tel"
        />
      </ResponsiveGrid>
    </Fieldset>
  );
};

export function Contacts() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { watch, setValue, getValues } = useFormContext<JohtoselvitysFormValues>();
  const hankeTunnus = getValues('hankeTunnus');

  const [propertyDeveloper, representative] = watch([
    'applicationData.propertyDeveloperWithContacts',
    'applicationData.representativeWithContacts',
  ]);

  const isPropertyDeveloper = Boolean(propertyDeveloper);
  const isRepresentative = Boolean(representative);

  function addCustomerWithContacts(customerType: CustomerType) {
    setValue(`applicationData.${customerType}`, getEmptyCustomerWithContacts());
  }

  function removeCustomerWithContacts(customerType: CustomerType) {
    setValue(`applicationData.${customerType}`, null);
  }

  const handleRemovePropertyDeveloper = !propertyDeveloper?.contacts[0]?.orderer
    ? () => removeCustomerWithContacts('propertyDeveloperWithContacts')
    : undefined;

  const handleRemoveRepresentative = !representative?.contacts[0]?.orderer
    ? () => removeCustomerWithContacts('representativeWithContacts')
    : undefined;

  return (
    <div>
      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h3" styleAs="h3" weight="light" spacingBottom="s">
        {t('form:yhteystiedot:titles:customerWithContactsInfo')}
      </Text>

      {/* Hakija */}
      <FormContact<CustomerType> contactType="customerWithContacts" hankeTunnus={hankeTunnus!}>
        <CustomerFields customerType="customerWithContacts" />
      </FormContact>

      {/* Työn suorittaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:contractorInfo')}
        headingLevel={3}
        initiallyOpen
      >
        <FormContact<CustomerType> contactType="contractorWithContacts" hankeTunnus={hankeTunnus!}>
          <CustomerFields customerType="contractorWithContacts" />
        </FormContact>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:propertyDeveloperInfo')}
        headingLevel={3}
        initiallyOpen={isPropertyDeveloper}
      >
        {isPropertyDeveloper && (
          <FormContact<CustomerType>
            contactType="propertyDeveloperWithContacts"
            hankeTunnus={hankeTunnus!}
            onRemove={handleRemovePropertyDeveloper}
          >
            <CustomerFields customerType="propertyDeveloperWithContacts" />
          </FormContact>
        )}

        {!isPropertyDeveloper && (
          <Button
            variant="supplementary"
            iconLeft={<IconPlusCircle aria-hidden="true" />}
            onClick={() => addCustomerWithContacts('propertyDeveloperWithContacts')}
          >
            {t('form:yhteystiedot:titles:lisaaRakennuttaja')}
          </Button>
        )}
      </Accordion>

      {/* Asianhoitaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:representativeInfo')}
        headingLevel={3}
        initiallyOpen={isRepresentative}
      >
        {isRepresentative && (
          <FormContact<CustomerType>
            contactType="representativeWithContacts"
            hankeTunnus={hankeTunnus!}
            onRemove={handleRemoveRepresentative}
          >
            <CustomerFields customerType="representativeWithContacts" />
          </FormContact>
        )}

        {!isRepresentative && (
          <Button
            variant="supplementary"
            iconLeft={<IconPlusCircle aria-hidden="true" />}
            onClick={() => addCustomerWithContacts('representativeWithContacts')}
          >
            {t('form:yhteystiedot:titles:addRepresentative')}
          </Button>
        )}
      </Accordion>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import ApplicationContacts from '../application/components/ApplicationContacts';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import Dropdown from '../../common/components/dropdown/Dropdown';
import { ContactType } from '../application/types/application';
import TextInput from '../../common/components/textInput/TextInput';
import { useFormContext } from 'react-hook-form';
import { KaivuilmoitusFormValues } from './types';
import { TFunction } from 'i18next';
import { HIDDEN_FIELD_VALUE } from '../application/constants';

function getInvoicingRegistryKeyLabel(
  t: TFunction<'translation', undefined>,
  selectedContactType: string | null,
) {
  if (selectedContactType === 'PERSON') {
    return t('form:yhteystiedot:labels:henkilotunnus');
  } else if (selectedContactType === 'OTHER') {
    return t('form:yhteystiedot:labels:muuTunnus');
  }
  return t('form:yhteystiedot:labels:ytunnus');
}

export default function Contacts() {
  const { t } = useTranslation();
  const { watch, setValue, resetField, trigger } = useFormContext<KaivuilmoitusFormValues>();

  const [
    selectedContactType,
    registryKey,
    registryKeyHidden,
    ovt,
    invoicingOperator,
    streetName,
    postalCode,
    city,
  ] = watch([
    'applicationData.invoicingCustomer.type',
    'applicationData.invoicingCustomer.registryKey',
    'applicationData.invoicingCustomer.registryKeyHidden',
    'applicationData.invoicingCustomer.ovt',
    'applicationData.invoicingCustomer.invoicingOperator',
    'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
    'applicationData.invoicingCustomer.postalAddress.postalCode',
    'applicationData.invoicingCustomer.postalAddress.city',
  ]);

  const ovtDisabled = selectedContactType === 'PERSON' || selectedContactType === 'OTHER';

  const postalAddressRequired = !ovt || !invoicingOperator;
  const ovtRequired = !ovtDisabled && (!streetName || !postalCode || !city);

  const isMounted = useRef(false);
  const [originalRegistryKeyIsHidden, setOriginalRegistryKeyIsHidden] = useState(false);

  useEffect(() => {
    // set a flag to mark the original registry key as hidden value in order to be able to revert back to it
    if (registryKey === HIDDEN_FIELD_VALUE) {
      setOriginalRegistryKeyIsHidden(true);
    }
  }, []);

  useEffect(() => {
    if (selectedContactType === 'PERSON' || selectedContactType === 'OTHER') {
      resetField('applicationData.invoicingCustomer.ovt', { defaultValue: '' });
      resetField('applicationData.invoicingCustomer.invoicingOperator', { defaultValue: '' });
    }

    if (isMounted.current) {
      // if the contact type is changed (after mount), clear the registry key
      resetField('applicationData.invoicingCustomer.registryKey', { defaultValue: '' });
      setOriginalRegistryKeyIsHidden(false);
    }
  }, [selectedContactType, setValue, resetField]);

  useEffect(() => {
    if (isMounted.current) {
      if (originalRegistryKeyIsHidden && registryKey === HIDDEN_FIELD_VALUE) {
        // set registry key hidden to true when changing the registry key back to the hidden value
        setValue('applicationData.invoicingCustomer.registryKeyHidden', true, {
          shouldValidate: true,
        });
      } else {
        // set registry key hidden to false when changing the registry key
        setValue('applicationData.invoicingCustomer.registryKeyHidden', false, {
          shouldValidate: true,
        });
      }
    }

    // mark the component as mounted
    isMounted.current = true;
  }, [registryKey, setValue]);

  useEffect(() => {
    if (!postalAddressRequired) {
      trigger([
        'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
        'applicationData.invoicingCustomer.postalAddress.postalCode',
        'applicationData.invoicingCustomer.postalAddress.city',
      ]);
    }
  }, [postalAddressRequired, trigger]);

  useEffect(() => {
    if (!ovtRequired) {
      trigger([
        'applicationData.invoicingCustomer.ovt',
        'applicationData.invoicingCustomer.invoicingOperator',
      ]);
    }
  }, [ovtRequired, trigger]);

  return (
    <>
      <ApplicationContacts />

      <Box marginTop="var(--spacing-l)" marginBottom="var(--spacing-l)" minInlineSize="auto">
        <Box marginBottom="var(--spacing-l)">
          <h3 className="heading-m">{t('form:yhteystiedot:titles:invoicingCustomerInfo')}</h3>
        </Box>
        <ResponsiveGrid>
          <Dropdown
            id="applicationData.invoicingCustomer.type"
            name="applicationData.invoicingCustomer.type"
            required
            defaultValue={ContactType.COMPANY}
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
            name="applicationData.invoicingCustomer.name"
            label={t('form:yhteystiedot:labels:nimi')}
            required
            autoComplete={selectedContactType === 'PERSON' ? 'name' : 'organization'}
          />
          <TextInput
            name="applicationData.invoicingCustomer.registryKey"
            label={getInvoicingRegistryKeyLabel(t, selectedContactType)}
            required
            autoComplete="on"
            defaultValue={null}
            helperText={registryKeyHidden ? t('form:yhteystiedot:helperTexts:registryKey') : ''}
          />
        </ResponsiveGrid>
        <ResponsiveGrid>
          <TextInput
            name="applicationData.invoicingCustomer.ovt"
            label={t('form:yhteystiedot:labels:ovt')}
            disabled={ovtDisabled}
            required={ovtRequired}
            defaultValue={null}
          />
          <TextInput
            name="applicationData.invoicingCustomer.invoicingOperator"
            label={t('form:yhteystiedot:labels:invoicingOperator')}
            disabled={ovtDisabled}
            required={ovtRequired}
            defaultValue={null}
          />
          <TextInput
            name="applicationData.invoicingCustomer.customerReference"
            label={t('form:yhteystiedot:labels:customerReference')}
          />
        </ResponsiveGrid>
        <ResponsiveGrid>
          <TextInput
            name="applicationData.invoicingCustomer.postalAddress.streetAddress.streetName"
            label={t('form:yhteystiedot:labels:osoite')}
            required={postalAddressRequired}
          />
          <TextInput
            name="applicationData.invoicingCustomer.postalAddress.postalCode"
            label={t('form:yhteystiedot:labels:postinumero')}
            required={postalAddressRequired}
          />
          <TextInput
            name="applicationData.invoicingCustomer.postalAddress.city"
            label={t('form:yhteystiedot:labels:postitoimipaikka')}
            required={postalAddressRequired}
          />
        </ResponsiveGrid>
        <ResponsiveGrid>
          <TextInput
            name="applicationData.invoicingCustomer.email"
            label={t('form:yhteystiedot:labels:email')}
            autoComplete="email"
          />
          <TextInput
            name="applicationData.invoicingCustomer.phone"
            label={t('form:yhteystiedot:labels:puhelinnumero')}
            autoComplete="tel"
          />
        </ResponsiveGrid>
      </Box>
    </>
  );
}

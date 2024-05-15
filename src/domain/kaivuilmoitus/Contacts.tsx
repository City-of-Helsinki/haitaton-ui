import { useEffect } from 'react';
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

export default function Contacts() {
  const { t } = useTranslation();
  const { watch, resetField, trigger } = useFormContext<KaivuilmoitusFormValues>();

  const [selectedContactType, ovt, invoicingOperator, customerReference] = watch([
    'applicationData.invoicingCustomer.type',
    'applicationData.invoicingCustomer.ovt',
    'applicationData.invoicingCustomer.invoicingOperator',
    'applicationData.invoicingCustomer.customerReference',
  ]);

  const ovtDisabled = selectedContactType === 'PERSON' || selectedContactType === 'OTHER';

  const postalAddressRequired = !ovt || !invoicingOperator || !customerReference;

  useEffect(() => {
    if (selectedContactType === 'PERSON' || selectedContactType === 'OTHER') {
      resetField('applicationData.invoicingCustomer.ovt', { defaultValue: '' });
      resetField('applicationData.invoicingCustomer.invoicingOperator', { defaultValue: '' });
      resetField('applicationData.invoicingCustomer.customerReference', { defaultValue: '' });
    }
  }, [selectedContactType, resetField]);

  useEffect(() => {
    if (!postalAddressRequired) {
      trigger([
        'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
        'applicationData.invoicingCustomer.postalAddress.postalCode',
        'applicationData.invoicingCustomer.postalAddress.city',
      ]);
    }
  }, [postalAddressRequired, trigger]);

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
            label={t('form:yhteystiedot:labels:yTunnusTaiHetu')}
            required
            autoComplete="on"
          />
        </ResponsiveGrid>
        <ResponsiveGrid>
          <TextInput
            name="applicationData.invoicingCustomer.ovt"
            label={t('form:yhteystiedot:labels:ovt')}
            disabled={ovtDisabled}
          />
          <TextInput
            name="applicationData.invoicingCustomer.invoicingOperator"
            label={t('form:yhteystiedot:labels:invoicingOperator')}
            disabled={ovtDisabled}
          />
          <TextInput
            name="applicationData.invoicingCustomer.customerReference"
            label={t('form:yhteystiedot:labels:customerReference')}
            disabled={ovtDisabled}
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

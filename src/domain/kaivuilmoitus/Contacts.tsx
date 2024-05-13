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
  const { watch } = useFormContext<KaivuilmoitusFormValues>();

  const [selectedContactType, ovt, invoicingOperator] = watch([
    'applicationData.invoicingCustomer.type',
    'applicationData.invoicingCustomer.registryKey',
    'applicationData.invoicingCustomer.ovt',
    'applicationData.invoicingCustomer.invoicingOperator',
  ]);

  const invoicingCustomerDisabled =
    selectedContactType === 'PERSON' || selectedContactType === 'OTHER';

  const postalAddressRequired = !ovt && !invoicingOperator;

  return (
    <>
      <ApplicationContacts />
      <Box marginTop="var(--spacing-l)" marginBottom="var(--spacing-l)" minInlineSize="auto">
        <h3 className="heading-m">Laskutustiedot</h3>
        <Box maxWidth="740px">
          <ResponsiveGrid maxColumns={2}>
            <Dropdown
              id="applicationData.invoicingCustomer.type"
              name="applicationData.invoicingCustomer.type"
              required
              defaultValue="PERSON"
              label={t('form:yhteystiedot:labels:tyyppi')}
              options={$enum(ContactType).map((value) => {
                return {
                  value,
                  label: t(`form:yhteystiedot:contactType:${value}`),
                };
              })}
            />
          </ResponsiveGrid>
        </Box>
        <Box maxWidth="740px">
          <ResponsiveGrid maxColumns={2}>
            <TextInput
              name="applicationData.invoicingCustomer.name"
              label={t('form:yhteystiedot:labels:nimi')}
              required
              autoComplete={selectedContactType === 'PERSON' ? 'name' : 'organization'}
            />
            <TextInput
              name="applicationData.invoicingCustomer.registryKey"
              label="Y-tunnus tai henkilötunnus"
              required
              autoComplete="on"
            />
          </ResponsiveGrid>
        </Box>
        <ResponsiveGrid>
          <TextInput
            name="applicationData.invoicingCustomer.ovt"
            label="OVT-tunnus"
            disabled={invoicingCustomerDisabled}
          />
          <TextInput
            name="applicationData.invoicingCustomer.invoicingOperator"
            label="Välittäjän tunnus"
            disabled={invoicingCustomerDisabled}
          />
          <TextInput
            name="applicationData.invoicingCustomer.customerReference"
            label="Asiakkaan viite"
            disabled={invoicingCustomerDisabled}
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
        <ResponsiveGrid maxColumns={2}>
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

import React from 'react';
import { useFormikContext } from 'formik';
import { Select, TextInput } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { ContactType, JohtoselvitysFormValues } from './types';

type Option = {
  value: string;
  label: string;
};

export const Contacts: React.FC = () => {
  const formik = useFormikContext<JohtoselvitysFormValues>();

  return (
    <div>
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>Hakija</div>
      <Select
        required
        label="Tyyppi"
        options={$enum(ContactType).map((contactType) => ({
          value: contactType,
          label: contactType,
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue(
            'applicationData.customerWithContacts.customer.type',
            selection.value
          );
        }}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.name"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.name}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.registryKey"
        label="Y-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.registryKey}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.ovt"
        label="OVT-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.ovt}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.email"
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.email}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.phone"
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.phone}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.postalAddress.streetAddress.streetName"
        label="Katuosoite"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.customerWithContacts.customer.postalAddress.streetAddress
            .streetName
        }
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.postalAddress.city"
        label="Postitoimipaikka"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.postalAddress.city}
      />
      <TextInput
        id="applicationData.customerWithContacts.customer.postalAddress.postalCode"
        label="Postinumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.postalAddress.postalCode}
      />
      <br />
      <br />
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>
        Yhteyshenkilön tiedot
      </div>
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].name"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.contacts[0].name}
      />
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].email"
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.contacts[0].email}
      />
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].phone"
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.contacts[0].phone}
      />
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].postalAddress.streetAddress.streetName"
        label="Katuosoite"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.customerWithContacts.contacts[0].postalAddress.streetAddress
            .streetName
        }
      />
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].postalAddress.city"
        label="Postitoimipaikka"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.contacts[0].postalAddress.city}
      />
      <TextInput
        id="applicationData.customerWithContacts.contacts[0].postalAddress.postalCode"
        label="Postinumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.customerWithContacts.contacts[0].postalAddress.postalCode
        }
      />
      <br />
      <br />
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>Työn suorittaja</div>
      <Select
        required
        label="Tyyppi"
        options={$enum(ContactType).map((contactType) => ({
          value: contactType,
          label: contactType,
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue(
            'applicationData.contractorWithContacts.customer.type',
            selection.value
          );
        }}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.name"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.name}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.registryKey"
        label="Y-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.registryKey}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.ovt"
        label="OVT-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.ovt}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.email"
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.email}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.phone"
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.phone}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.postalAddress.streetAddress.streetName"
        label="Katuosoite"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.contractorWithContacts.customer.postalAddress.streetAddress
            .streetName
        }
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.postalAddress.city"
        label="Postitoimipaikka"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.postalAddress.city}
      />
      <TextInput
        id="applicationData.contractorWithContacts.customer.postalAddress.postalCode"
        label="Postinumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.contractorWithContacts.customer.postalAddress.postalCode
        }
      />
      <br />
      <br />
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>
        Yhteyshenkilön tiedot
      </div>
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].name"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.contacts[0].name}
      />
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].email"
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.contacts[0].email}
      />
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].phone"
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.contacts[0].phone}
      />
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].postalAddress.streetAddress.streetName"
        label="Katuosoite"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.contractorWithContacts.contacts[0].postalAddress
            .streetAddress.streetName
        }
      />
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].postalAddress.city"
        label="Postitoimipaikka"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.contacts[0].postalAddress.city}
      />
      <TextInput
        id="applicationData.contractorWithContacts.contacts[0].postalAddress.postalCode"
        label="Postinumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          formik.values.applicationData.contractorWithContacts.contacts[0].postalAddress.postalCode
        }
      />
    </div>
  );
};
export default Contacts;

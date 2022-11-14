import React from 'react';
import { useFormikContext } from 'formik';
import { Select, TextInput } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { ContactType, JohtoselvitysFormValues } from './types';
import styles from './Contacts.module.scss';

type Option = {
  value: string;
  label: string;
};

export const Contacts: React.FC<React.PropsWithChildren<unknown>> = () => {
  const formik = useFormikContext<JohtoselvitysFormValues>();

  return (
    <div className={styles.gridContainer}>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Hakija
      </div>
      <div className={styles.gridItem50}>
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
      </div>
      <br />
      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.customer.name"
          label="Nimi"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.customer.name}
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.customer.registryKey"
          label="Y-tunnus"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.customer.registryKey}
        />
      </div>
      <br />

      {/* TODO: HAI-1164 OVT-tunnuksen lisääminen
      <TextInput
        id="applicationData.customerWithContacts.customer.ovt"
        label="OVT-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.customerWithContacts.customer.ovt}
      />
      */}

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.customer.email"
          label="Sähköposti"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.customer.email}
        />
      </div>
      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.customerWithContacts.customer.phone"
          label="Puhelinnumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.customer.phone}
        />
      </div>

      <div className={styles.gridItem50}>
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
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.customer.postalAddress.city"
          label="Postitoimipaikka"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.customer.postalAddress.city}
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.customerWithContacts.customer.postalAddress.postalCode"
          label="Postinumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.customerWithContacts.customer.postalAddress.postalCode
          }
        />
      </div>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Yhteyshenkilön tiedot
      </div>
      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].name"
          label="Nimi"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.contacts[0].name}
        />
      </div>
      <br />
      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].email"
          label="Sähköposti"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.contacts[0].email}
        />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].phone"
          label="Puhelinnumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.contacts[0].phone}
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.streetAddress.streetName"
          label="Katuosoite"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.customerWithContacts.contacts[0].postalAddress
              .streetAddress.streetName
          }
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.city"
          label="Postitoimipaikka"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.customerWithContacts.contacts[0].postalAddress.city}
        />
      </div>
      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.postalCode"
          label="Postinumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.customerWithContacts.contacts[0].postalAddress.postalCode
          }
        />
      </div>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Työn suorittaja
      </div>
      <div className={styles.gridItem50}>
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
      </div>
      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.name"
          label="Nimi"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.customer.name}
        />
      </div>
      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.registryKey"
          label="Y-tunnus"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.customer.registryKey}
        />
      </div>
      {/* TODO: HAI-1164 OVT-tunnuksen lisääminen
      <TextInput
        id="applicationData.contractorWithContacts.customer.ovt"
        label="OVT-tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.contractorWithContacts.customer.ovt}
      />
      */}

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.email"
          label="Sähköposti"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.customer.email}
        />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.phone"
          label="Puhelinnumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.customer.phone}
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.streetAddress.streetName"
          label="Katuosoite"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.contractorWithContacts.customer.postalAddress
              .streetAddress.streetName
          }
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.city"
          label="Postitoimipaikka"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.customer.postalAddress.city}
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.postalCode"
          label="Postinumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.contractorWithContacts.customer.postalAddress.postalCode
          }
        />
      </div>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Yhteyshenkilön tiedot
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].name"
          label="Nimi"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.contacts[0].name}
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].email"
          label="Sähköposti"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.contacts[0].email}
        />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].phone"
          label="Puhelinnumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.applicationData.contractorWithContacts.contacts[0].phone}
        />
      </div>

      <div className={styles.gridItem50}>
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
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].postalAddress.city"
          label="Postitoimipaikka"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.contractorWithContacts.contacts[0].postalAddress.city
          }
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].postalAddress.postalCode"
          label="Postinumero"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={
            formik.values.applicationData.contractorWithContacts.contacts[0].postalAddress
              .postalCode
          }
        />
      </div>
    </div>
  );
};
export default Contacts;

import React from 'react';
import { Select, TextInput } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { ContactType } from './types';
import styles from './Contacts.module.scss';

// type Option = {
//   value: string;
//   label: string;
// };

export const Contacts: React.FC = () => {
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
        />
      </div>
      <br />
      <div className={styles.gridItem50}>
        <TextInput id="applicationData.customerWithContacts.customer.name" label="Nimi" />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.customer.registryKey"
          label="Y-tunnus"
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
        <TextInput id="applicationData.customerWithContacts.customer.email" label="Sähköposti" />
      </div>
      <div className={styles.gridItem150}>
        <TextInput id="applicationData.customerWithContacts.customer.phone" label="Puhelinnumero" />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.customer.postalAddress.streetAddress.streetName"
          label="Katuosoite"
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.customer.postalAddress.city"
          label="Postitoimipaikka"
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.customerWithContacts.customer.postalAddress.postalCode"
          label="Postinumero"
        />
      </div>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Yhteyshenkilön tiedot
      </div>
      <div className={styles.gridItem50}>
        <TextInput id="applicationData.customerWithContacts.contacts[0].name" label="Nimi" />
      </div>
      <br />
      <div className={styles.gridItem50}>
        <TextInput id="applicationData.customerWithContacts.contacts[0].email" label="Sähköposti" />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].phone"
          label="Puhelinnumero"
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.streetAddress.streetName"
          label="Katuosoite"
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.city"
          label="Postitoimipaikka"
        />
      </div>
      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.customerWithContacts.contacts[0].postalAddress.postalCode"
          label="Postinumero"
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
        />
      </div>
      <div className={styles.gridItem50}>
        <TextInput id="applicationData.contractorWithContacts.customer.name" label="Nimi" />
      </div>
      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.registryKey"
          label="Y-tunnus"
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
        <TextInput id="applicationData.contractorWithContacts.customer.email" label="Sähköposti" />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.phone"
          label="Puhelinnumero"
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.streetAddress.streetName"
          label="Katuosoite"
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.city"
          label="Postitoimipaikka"
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.contractorWithContacts.customer.postalAddress.postalCode"
          label="Postinumero"
        />
      </div>
      <div
        style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}
        className={styles.fullRow}
      >
        Yhteyshenkilön tiedot
      </div>

      <div className={styles.gridItem50}>
        <TextInput id="applicationData.contractorWithContacts.contacts[0].name" label="Nimi" />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].email"
          label="Sähköposti"
        />
      </div>

      <div className={styles.gridItem150}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].phone"
          label="Puhelinnumero"
        />
      </div>

      <div className={styles.gridItem50}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].postalAddress.streetAddress.streetName"
          label="Katuosoite"
        />
      </div>

      <div className={styles.gridItem125}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].postalAddress.city"
          label="Postitoimipaikka"
        />
      </div>

      <div className={styles.gridItem225}>
        <TextInput
          id="applicationData.contractorWithContacts.contacts[0].postalAddress.postalCode"
          label="Postinumero"
        />
      </div>
    </div>
  );
};
export default Contacts;

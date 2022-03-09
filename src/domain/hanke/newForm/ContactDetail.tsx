import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { TextInput, Checkbox, Select } from 'hds-react';
import { Organization } from '../edit/types';
import { HakemusFormValues, HankeContact, HANKE_CONTACT_KEY, Option } from './types';
import styles from './ContactDetail.module.scss';

type Props = {
  contactType: HANKE_CONTACT_KEY;
  index: number;
  organizationList: Organization[];
};

const ContactDetail: React.FC<Props> = ({ contactType, index, organizationList }) => {
  const [addOmaOrganisaatio, setAddOmaOrganisaatio] = useState(false);
  const formik = useFormikContext<HakemusFormValues>();

  const getErrorMessage = (type: HANKE_CONTACT_KEY, i: number, fieldname: keyof HankeContact) => {
    const touchedContactFields = formik.touched[type];
    if (touchedContactFields !== undefined) {
      if (touchedContactFields[i] && touchedContactFields[i][fieldname]) {
        return `Virhe kentässä: ${fieldname}`; // lokalisoitu virheviesti
      }
    }
    return undefined;
  };

  return (
    <div className={styles.contactContainer}>
      <TextInput
        className={styles.input}
        id={`${contactType}.${index}.etunimi`}
        label="Etunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].etunimi}
        errorText={getErrorMessage(contactType, index, 'etunimi')}
      />
      <TextInput
        className={styles.input}
        id={`${contactType}.${index}.sukunimi`}
        label="Sukunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].sukunimi}
        errorText={getErrorMessage(contactType, index, 'sukunimi')}
      />
      <TextInput
        className={styles.input}
        id={`${contactType}.${index}.email`}
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].email}
        errorText={getErrorMessage(contactType, index, 'email')}
      />
      <TextInput
        className={styles.input}
        id={`${contactType}.${index}.puhelinnumero`}
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].puhelinnumero}
        errorText={getErrorMessage(contactType, index, 'puhelinnumero')}
      />
      <Select
        className={styles.input}
        id={`${contactType}.${index}.organisaatioId`}
        disabled={addOmaOrganisaatio}
        label="Organisaatio"
        options={organizationList.map((organization) => ({
          value: organization.id.toString(),
          label: organization.nimi,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue(
            `${contactType}.${index}.organisaatioId`,
            parseInt(option.value, 10)
          );
        }}
      />
      <br />
      <Checkbox
        className={styles.input}
        id={`${contactType}.${index}.addOmaOrganisaatio`}
        name="addOmaOrganisaatio"
        label="Lisää oma organisaatio"
        checked={addOmaOrganisaatio}
        onChange={() => {
          setAddOmaOrganisaatio(!addOmaOrganisaatio);
        }}
      />
      <TextInput
        className={styles.input}
        id={`${contactType}.${index}.organisaatioNimi`}
        label="Syötä oma organisaatio"
        disabled={!addOmaOrganisaatio}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].organisaatioNimi}
      />
    </div>
  );
};
export default ContactDetail;

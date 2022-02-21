import { useFormikContext } from 'formik';
import { TextInput, Checkbox, Select } from 'hds-react';
import React, { useState } from 'react';
import { Organization } from '../edit/types';
import { HakemusFormValues, HANKE_CONTACT_KEY, Option } from './types';

type Props = {
  contactType: HANKE_CONTACT_KEY;
  index: number;
  organizationList: Organization[];
};

const ContactDetails: React.FC<Props> = ({ contactType, index, organizationList }) => {
  const [addOmaOrganisaatio, setAddOmaOrganisaatio] = useState(false);
  const formik = useFormikContext<HakemusFormValues>();

  return (
    <div>
      <h1>ContactType: {contactType}</h1>
      <h2>{JSON.stringify(formik.values[contactType])}</h2>
      <TextInput
        id={`${contactType}.${index}.etunimi`}
        label="Etunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].etunimi}
      />
      <TextInput
        id={`${contactType}.${index}.sukunimi`}
        label="Sukunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].sukunimi}
      />
      <TextInput
        id={`${contactType}.${index}.email`}
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].email}
      />
      <TextInput
        id={`${contactType}.${index}.puhelinnumero`}
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].puhelinnumero}
      />
      <Select
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
      <Checkbox
        id={`${contactType}.${index}.addOmaOrganisaatio`}
        name="addOmaOrganisaatio"
        label="Lisää oma organisaatio"
        checked={addOmaOrganisaatio}
        onChange={() => {
          setAddOmaOrganisaatio(!addOmaOrganisaatio);
        }}
      />
      <TextInput
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
export default ContactDetails;

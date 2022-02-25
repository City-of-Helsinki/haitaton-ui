import { useFormikContext } from 'formik';
import { TextInput, Checkbox, Combobox } from 'hds-react';
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
      <TextInput
        id={`${contactType}-${index}-etunimi`}
        label="Etunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].etunimi}
      />
      <TextInput
        id={`${contactType}-${index}-sukunimi`}
        label="Sukunimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].sukunimi}
      />
      <TextInput
        id={`${contactType}-${index}-email`}
        label="Sähköposti"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].email}
      />
      <TextInput
        id={`${contactType}-${index}-puhelinnumero`}
        label="Puhelinnumero"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].puhelinnumero}
      />
      <Combobox<Option>
        id={`${contactType}-${index}-organisaatio`}
        label="Organisaatio"
        disabled={addOmaOrganisaatio}
        clearButtonAriaLabel="Clear selection"
        selectedItemRemoveButtonAriaLabel="Remove"
        toggleButtonAriaLabel="toggle selection"
        options={organizationList.map((organization) => ({
          value: organization.id.toString(),
          label: organization.nimi,
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue(`${contactType}-{index}-organisaatio`, selection.value);
        }}
      />
      <Checkbox
        id={`${contactType}-${index}-addOmaOrganisaatio`}
        name="addOmaOrganisaatio"
        label="Lisää oma organisaatio"
        checked={addOmaOrganisaatio}
        onChange={() => {
          setAddOmaOrganisaatio(!addOmaOrganisaatio);
        }}
      />
      <TextInput
        id={`${contactType}-${index}-omaOrganisaatio`}
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

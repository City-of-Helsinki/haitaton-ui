import { useFormikContext } from 'formik';
import { TextInput, Checkbox, Combobox } from 'hds-react';
import React, { useState } from 'react';
import { HakemusFormValues, HANKE_CONTACT_KEY, Option } from './types';

type Props = {
  contactType: HANKE_CONTACT_KEY;
  index: number;
};

const ContactDetails: React.FC<Props> = ({ contactType, index }) => {
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
        clearButtonAriaLabel="Clear selection"
        selectedItemRemoveButtonAriaLabel="Remove"
        toggleButtonAriaLabel="toggle selection"
        options={[{ label: 'asd', value: 'ysd' }]}
        onChange={(change: Option) => {
          console.log('Vaihtui');
          console.log(change);
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

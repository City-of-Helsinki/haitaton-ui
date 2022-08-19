import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { TextInput, Checkbox, Select } from 'hds-react';
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../edit/types';
import {
  HakemusFormValues,
  HankeContact,
  HANKE_CONTACT_KEY,
  HANKE_CONTACT_TYPE,
  Option,
} from './types';
import { getFormErrorText } from '../../forms/utils';

type Props = {
  contactType: HANKE_CONTACT_KEY;
  index: number;
  organizationList: Organization[];
};

const ContactDetail: React.FC<Props> = ({ contactType, index, organizationList }) => {
  const { t } = useTranslation();
  const [addOmaOrganisaatio, setAddOmaOrganisaatio] = useState(false);
  const formik = useFormikContext<HakemusFormValues>();

  const getErrorMessage = (type: HANKE_CONTACT_KEY, i: number, fieldname: keyof HankeContact) => {
    return getFormErrorText(t, formik.errors[type]?.[i], formik?.touched[type]?.[i], fieldname);
  };

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={10} mb={20}>
      <TextInput
        id={`${contactType}.${index}.etunimi`}
        label={t('hankeForm:labels:etunimi')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].etunimi}
        errorText={getErrorMessage(contactType, index, 'etunimi')}
        required={contactType === HANKE_CONTACT_TYPE.OMISTAJAT}
      />
      <TextInput
        id={`${contactType}.${index}.sukunimi`}
        label={t('hankeForm:labels:sukunimi')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].sukunimi}
        errorText={getErrorMessage(contactType, index, 'sukunimi')}
        required={contactType === HANKE_CONTACT_TYPE.OMISTAJAT}
      />
      <TextInput
        id={`${contactType}.${index}.email`}
        label={t('hankeForm:labels:email')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].email}
        errorText={getErrorMessage(contactType, index, 'email')}
        required={contactType === HANKE_CONTACT_TYPE.OMISTAJAT}
      />
      <TextInput
        id={`${contactType}.${index}.puhelinnumero`}
        label={t('hankeForm:labels:puhelinnumero')}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].puhelinnumero}
        errorText={getErrorMessage(contactType, index, 'puhelinnumero')}
        required={contactType === HANKE_CONTACT_TYPE.OMISTAJAT}
      />
      <Select
        id={`${contactType}.${index}.organisaatioId`}
        disabled={addOmaOrganisaatio}
        label={t('hankeForm:labels:organisaatio')}
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
        id={`${contactType}.${index}.addOmaOrganisaatio`}
        name="addOmaOrganisaatio"
        label={t('hankeForm:labels:omaOrganisaatio')}
        checked={addOmaOrganisaatio}
        onChange={() => {
          setAddOmaOrganisaatio(!addOmaOrganisaatio);
        }}
      />
      <TextInput
        id={`${contactType}.${index}.organisaatioNimi`}
        label={t('hankeForm:labels:insertOmaOrganisaatio')}
        disabled={!addOmaOrganisaatio}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[contactType][index].organisaatioNimi}
      />
    </Grid>
  );
};
export default ContactDetail;

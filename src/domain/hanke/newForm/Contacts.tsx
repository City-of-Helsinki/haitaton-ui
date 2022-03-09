import { useFormikContext } from 'formik';
import { Button, IconPlusCircle, IconTrash } from 'hds-react';
import React from 'react';
import * as Yup from 'yup';
import { useQuery } from 'react-query';
import { $enum } from 'ts-enum-util';
import api from '../../api/api';
import { Organization } from '../edit/types';
import ContactDetail from './ContactDetail';
import { HakemusFormValues, HankeContact, HANKE_CONTACT_KEY, HANKE_CONTACT_TYPE } from './types';
import styles from './Contacts.module.scss';

const contactSchema = Yup.object().shape({
  etunimi: Yup.string().required('Tieto tarvitaan'),
  sukunimi: Yup.string().required('Tieto tarvitaan'),
  email: Yup.string().required('Tieto tarvitaan'),
});

export const contactsValidationSchema = {
  omistajat: Yup.array().of(contactSchema),
  toteuttajat: Yup.array().of(contactSchema),
  arvioijat: Yup.array().of(contactSchema),
};

export const initialContact: HankeContact = {
  etunimi: '',
  sukunimi: '',
  email: '',
  id: null,
  organisaatioId: null,
  organisaatioNimi: '',
  osasto: '',
  puhelinnumero: '',
};

export const initialValues = {
  omistajat: [initialContact],
  toteuttajat: [initialContact],
  arvioijat: [initialContact],
};

export const Contacts: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();

  const fetchOrganizations = async () => api.get<Organization[]>('/organisaatiot');
  const { data: organizationList } = useQuery('organisationList', fetchOrganizations, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const addContact = (contactType: HANKE_CONTACT_KEY) => {
    formik.values[contactType].push(initialContact);
    forceUpdate();
  };

  const deleteContact = (contactType: HANKE_CONTACT_KEY, index: number) => {
    formik.values[contactType].splice(index, 1);
    forceUpdate();
  };

  return (
    <div>
      {$enum(HANKE_CONTACT_TYPE).map((contactType) => (
        <div>
          <p>{JSON.stringify(formik.errors)}</p>
          <div className={styles.contactTypeContainer}>
            <h3 style={{ fontSize: 'var(--fontsize-heading-l) ' }} className={styles.contactTitle}>
              {contactType}
            </h3>
            {formik.values[contactType].map((hankeContact, index) => {
              return (
                <>
                  <ContactDetail
                    contactType={contactType}
                    index={index}
                    organizationList={organizationList ? organizationList.data : []}
                  />
                  {formik.values[contactType].length === index + 1 ? (
                    <Button
                      variant="supplementary"
                      iconLeft={<IconPlusCircle />}
                      onClick={() => addContact(contactType)}
                    >
                      Lisää toinen yhteyshenkilö
                    </Button>
                  ) : (
                    ''
                  )}
                  {index > 0 ? (
                    <Button
                      variant="supplementary"
                      iconLeft={<IconTrash />}
                      onClick={() => deleteContact(contactType, index)}
                    >
                      Poista kontakti
                    </Button>
                  ) : (
                    ''
                  )}
                </>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Contacts;

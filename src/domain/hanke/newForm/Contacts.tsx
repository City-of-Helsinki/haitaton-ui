import { useFormikContext } from 'formik';
import { Button, IconPlusCircle, IconTrash } from 'hds-react';
import React from 'react';
import { useQuery } from 'react-query';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import api from '../../api/api';
import { Organization } from '../edit/types';
import ContactDetail from './ContactDetail';
import { HakemusFormValues, HankeContact, HANKE_CONTACT_KEY, HANKE_CONTACT_TYPE } from './types';
import styles from './Contacts.module.scss';
import Text from '../../../common/components/text/Text';
import { contactSchema, requiredContactSchema } from '../edit/hankeSchema';
import yup from '../../../common/utils/yup';

export const contactsValidationSchema = {
  omistajat: yup.array().of(requiredContactSchema),
  toteuttajat: yup.array().of(contactSchema),
  arvioijat: yup.array().of(contactSchema),
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
  const { t } = useTranslation();
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
      <Text tag="h1" spacing="s" weight="bold" styleAs="h3">
        {t('hankeForm:hankkeenYhteystiedotForm:header')}
      </Text>
      {$enum(HANKE_CONTACT_TYPE).map((contactType) => (
        <div key={contactType}>
          {/* <p>{JSON.stringify(formik.errors)}</p> */}
          <div className={styles.contactTypeContainer}>
            <Text tag="h2" spacing="s" weight="bold" styleAs="h4">
              {t(`hankeForm:headers:${contactType}`)}
            </Text>
            {formik.values[contactType].map((hankeContact, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
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
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Contacts;

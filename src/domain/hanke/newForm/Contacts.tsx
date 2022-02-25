import { useFormikContext } from 'formik';
import { Button } from 'hds-react';
import React from 'react';
import { useQuery } from 'react-query';
import { $enum } from 'ts-enum-util';
import api from '../../api/api';
import { Organization } from '../edit/types';
import ContactDetails from './ContactDetail';
import { HakemusFormValues, HANKE_CONTACT_KEY, HANKE_CONTACT_TYPE, initialContact } from './types';

const Contacts: React.FC = () => {
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
          {formik.values[contactType].map((hankeContact, index) => {
            return (
              <>
                <ContactDetails
                  contactType={contactType}
                  index={index}
                  organizationList={organizationList ? organizationList.data : []}
                />
                {index > 0 ? (
                  <Button onClick={() => deleteContact(contactType, index)}>Poista kontakti</Button>
                ) : (
                  ''
                )}
                {formik.values[contactType].length === index + 1 ? (
                  <Button onClick={() => addContact(contactType)}>
                    Lisää kontakti {contactType}
                  </Button>
                ) : (
                  ''
                )}
              </>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default Contacts;

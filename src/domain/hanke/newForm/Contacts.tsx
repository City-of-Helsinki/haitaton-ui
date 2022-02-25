import { useFormikContext } from 'formik';
import React from 'react';
import { $enum } from 'ts-enum-util';
import ContactDetails from './ContactDetail';
import { HakemusFormValues, HANKE_CONTACT_TYPE } from './types';

const Contacts: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  console.log(formik);

  // NEXT: Loop over contact details

  return (
    <div>
      {$enum(HANKE_CONTACT_TYPE).map((contactType) => (
        <div>
          <p>{contactType}</p>
          {formik.values[contactType].map((hankeContact, index) => {
            return <ContactDetails contactType={contactType} index={index} />;
          })}
        </div>
      ))}
    </div>
  );
};
export default Contacts;

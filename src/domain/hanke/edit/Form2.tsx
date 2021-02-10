import React from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { useTypedController } from '@hookform/strictly-typed';
import { TextInput } from 'hds-react';
import { CONTACT_FORMFIELD, FormProps, HankeDataFormState, Organization } from './types';
import { HANKE_CONTACT_TYPE } from '../../types/hanke';

import api from '../../api/api';
import { getInputErrorText } from '../../../common/utils/form';
import H2 from '../../../common/components/text/H2';
import H3 from '../../../common/components/text/H3';
import { useFormPage } from './hooks/useFormPage';
import OrganizationSelect from './OrganizationSelect';

const CONTACT_FIELDS = [
  CONTACT_FORMFIELD.ETUNIMI,
  CONTACT_FORMFIELD.SUKUNIMI,
  CONTACT_FORMFIELD.EMAIL,
  CONTACT_FORMFIELD.PUHELINNUMERO,
  CONTACT_FORMFIELD.OSASTO,
];

const fetchOrganizations = async () => {
  const response = await api.get<Organization[]>('/organisaatiot');
  return response;
};

// eslint-disable-next-line
const getArrayFieldErrors = (errors: Record<string, Array<any>>, name: string) =>
  errors && errors[name] && errors[name][0] ? errors[name][0] : {};

const Form2: React.FC<FormProps> = ({ control, formData, errors, register }) => {
  useFormPage();
  const { t } = useTranslation();
  const TypedController = useTypedController<HankeDataFormState>({ control });

  const { data: organizationList } = useQuery('organisationList', fetchOrganizations, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // If future, we'll have multiple contacts per contactType
  // Then we should use react-hook-form useFieldArray and remove this hard coded index
  const contactIndex = 0;

  return (
    <div className="form2">
      <H2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</H2>
      {$enum(HANKE_CONTACT_TYPE).map((contactType) => (
        <div key={contactType}>
          <H3>{t(`hankeForm:headers:${contactType}`)}</H3>
          <div className="formColumns">
            {CONTACT_FIELDS.map((contactField) => {
              const contactData = formData[contactType][contactIndex];
              return (
                <React.Fragment key={contactField}>
                  <TypedController
                    name={[contactType, contactIndex, contactField]}
                    defaultValue={contactData ? contactData[contactField] : ''}
                    render={(props) => (
                      <TextInput
                        className="formItem"
                        label={t(`hankeForm:labels:${contactField}`)}
                        id={`${contactType}-${contactField}`}
                        ref={register}
                        data-testid={`${contactType}-${contactField}`}
                        helperText={getInputErrorText(
                          t,
                          getArrayFieldErrors(errors, contactType),
                          contactField
                        )}
                        invalid={!!getArrayFieldErrors(errors, contactType)[contactField]}
                        {...props}
                      />
                    )}
                  />
                  {contactField === CONTACT_FORMFIELD.PUHELINNUMERO && (
                    <OrganizationSelect
                      contactType={contactType}
                      organizations={organizationList ? organizationList.data : []}
                      isOwnOrganization={
                        contactData?.organisaatioId === null &&
                        contactData?.organisaatioNimi.length > 0
                      }
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Form2;

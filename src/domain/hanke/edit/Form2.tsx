import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTypedController } from '@hookform/strictly-typed';
import { TextInput } from 'hds-react';
import { FormProps, FORMFIELD, CONTACT_FORMFIELD, HankeDataDraft } from './types';
import H2 from '../../../common/components/text/H2';
import H3 from '../../../common/components/text/H3';
import Autocomplete, { Option } from '../../../common/components/autocomplete/Autocomplete';

const CONTACT_TYPES = [FORMFIELD.OMISTAJAT, FORMFIELD.ARVIOIJAT, FORMFIELD.TOTEUTTAJAT];
const CONTACT_FIELDS = [
  CONTACT_FORMFIELD.ETUNIMI,
  CONTACT_FORMFIELD.SUKUNIMI,
  CONTACT_FORMFIELD.EMAIL,
  CONTACT_FORMFIELD.PUHELINNUMERO,
  CONTACT_FORMFIELD.OSASTO,
];

const organisaatioOptions = [
  { label: 'Organisaatio 1', value: 1 },
  { label: 'Organisaatio 2', value: 2 },
];

const Form2: React.FC<FormProps> = ({ control, formData, register }) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const TypedController = useTypedController<HankeDataDraft>({ control });

  // Autocomplete doesnt register fields so we need manually register them
  useEffect(() => {
    CONTACT_TYPES.forEach((contactType) => {
      register({ name: `${contactType}[0].organisaatioNimi`, type: 'custom' }, { required: false });
      register({ name: `${contactType}[0].organisaatioId`, type: 'custom' }, { required: false });
    });
  }, []);

  return (
    <div className="form2">
      <H2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</H2>
      {CONTACT_TYPES.map((CONTACT_TYPE) => (
        <div key={CONTACT_TYPE}>
          <H3>{t(`hankeForm:headers:${CONTACT_TYPE}`)}</H3>
          <div className="formColumns">
            {CONTACT_FIELDS.map((contactField) => (
              <React.Fragment key={contactField}>
                <TypedController
                  // eslint-disable-next-line
                  // @ts-ignore
                  name={[CONTACT_TYPE, 0, contactField]}
                  defaultValue={
                    // eslint-disable-next-line
                    // @ts-ignore
                    formData[CONTACT_TYPE] ? formData[CONTACT_TYPE][0][contactField] : ''
                  }
                  render={(formProps) => (
                    <TextInput
                      className="formItem"
                      id={`${CONTACT_TYPE}-${contactField}`}
                      {...formProps}
                      label={t(`hankeForm:labels:${contactField}`)}
                    />
                  )}
                />
                {contactField === CONTACT_FORMFIELD.PUHELINNUMERO && (
                  <Autocomplete
                    className="formItem"
                    label={t(`hankeForm:labels:organisaatio`)}
                    options={organisaatioOptions}
                    // eslint-disable-next-line
                    // @ts-ignore
                    defaultValue={{
                      // eslint-disable-next-line
                      // @ts-ignore
                      label: formData[CONTACT_TYPE][0].organisaatioNimi,
                      // eslint-disable-next-line
                      // @ts-ignore
                      value: formData[CONTACT_TYPE][0].organisaatioId,
                    }}
                    onChange={(option: Option): void => {
                      setValue(`${CONTACT_TYPE}[0].organisaatioId`, option.value);
                      setValue(`${CONTACT_TYPE}[0].organisaatioNimi`, option.label);
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Form2;

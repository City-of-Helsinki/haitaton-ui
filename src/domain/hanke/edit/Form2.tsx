import React from 'react';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { useTypedController } from '@hookform/strictly-typed';
import { TextInput } from 'hds-react';
import { FormProps, FORMFIELD, CONTACT_FORMFIELD, HankeDataDraft } from './types';
import H2 from '../../../common/components/text/H2';
import H3 from '../../../common/components/text/H3';

const CONTACT_FIELDS = [FORMFIELD.OMISTAJAT, FORMFIELD.ARVIOIJAT, FORMFIELD.TOTEUTTAJAT];

const Form2: React.FC<FormProps> = ({ control, formData }) => {
  const { t } = useTranslation();
  const TypedController = useTypedController<HankeDataDraft>({ control });

  return (
    <div className="form2">
      <H2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</H2>
      {CONTACT_FIELDS.map((FIELD) => (
        <div key={FIELD}>
          <H3>{t(`hankeForm:headers:${FIELD}`)}</H3>
          <div className="formColumns">
            {$enum(CONTACT_FORMFIELD)
              .getValues()
              .map((contactField) => (
                <TypedController
                  key={contactField}
                  // eslint-disable-next-line
                  // @ts-ignore
                  name={[FIELD, 0, contactField]}
                  // eslint-disable-next-line
                  // @ts-ignore
                  defaultValue={formData[FIELD] ? formData[FIELD][0][contactField] : ''}
                  render={(formProps) => (
                    <TextInput
                      className="formItem"
                      id={`${FIELD}-${contactField}`}
                      {...formProps}
                      label={t(`hankeForm:labels:${contactField}`)}
                    />
                  )}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Form2;

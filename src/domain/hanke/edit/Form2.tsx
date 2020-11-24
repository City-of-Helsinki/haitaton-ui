import React from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../../common/components/textInput/TextInput';
import PropTypes from './PropTypes';
import { FORMFIELD } from './types';

const Form2: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  const { control, errors } = props;
  return (
    <div className="form2">
      <h2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</h2>
      <div className="formWprColumns">
        <div className="left">
          <TextInput
            name={FORMFIELD.OMISTAJAORGANISAATIO}
            id={FORMFIELD.OMISTAJAORGANISAATIO}
            label={t(`hankeForm:labels:${FORMFIELD.OMISTAJAORGANISAATIO}`)}
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors[FORMFIELD.OMISTAJAORGANISAATIO]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
        <div className="right">
          <TextInput
            name={FORMFIELD.OMISTAJAOASTO}
            id={FORMFIELD.OMISTAJAOASTO}
            label={t(`hankeForm:labels:${FORMFIELD.OMISTAJAOASTO}`)}
            control={control}
            defaultValue=""
          />
        </div>
      </div>
      <div className="formWprColumns">
        <div className="left">
          <TextInput
            name={FORMFIELD.ARVIOIJAORGANISAATIO}
            id={FORMFIELD.ARVIOIJAORGANISAATIO}
            label={t(`hankeForm:labels:${FORMFIELD.ARVIOIJAORGANISAATIO}`)}
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors[FORMFIELD.ARVIOIJAORGANISAATIO]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
        <div className="right">
          <TextInput
            name={FORMFIELD.ARVIOIJAOSASTO}
            id={FORMFIELD.ARVIOIJAOSASTO}
            label={t(`hankeForm:labels:${FORMFIELD.ARVIOIJAOSASTO}`)}
            control={control}
            defaultValue=""
          />
        </div>
      </div>
    </div>
  );
};
export default Form2;

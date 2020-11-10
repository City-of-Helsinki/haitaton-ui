import React from 'react';
import { useTranslation } from 'react-i18next';

import TextInput from '../../../common/components/textInput/TextInput';

import PropTypes from './PropTypes';

const Form2: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  const { control, errors } = props;
  return (
    <div className="form2">
      <h2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</h2>
      <div className="formWprColumns">
        <div className="left">
          <TextInput
            name="omistajaOrganisaatio"
            id="omistajaOrganisaatio"
            label={t('hankeForm:hankkeenYhteystiedotForm:omistajaorganisaatioLabel')}
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.omistajaOrganisaatio}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
        <div className="right">
          <TextInput
            name="omistajaOsasto"
            id="omistajaOsasto"
            label={t('hankeForm:hankkeenYhteystiedotForm:omistajaosastoLabel')}
            control={control}
            defaultValue=""
          />
        </div>
      </div>
      <div className="formWprColumns">
        <div className="left">
          <TextInput
            name="arvioijaOrganisaatio"
            id="arvioijaOrganisaatio"
            label={t('hankeForm:hankkeenYhteystiedotForm:omistajaNimiLabel')}
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.arvioijaOrganisaatio}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
        <div className="right">
          <TextInput
            name="arvioijaOsasto"
            id="arvioijaOsasto"
            label={t('hankeForm:hankkeenYhteystiedotForm:arvioijaosastoLabel')}
            control={control}
            defaultValue=""
          />
        </div>
      </div>
    </div>
  );
};
export default Form2;

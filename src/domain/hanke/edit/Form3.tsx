import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import PropTypes from './PropTypes';

import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import H2 from '../../../common/components/text/H2';
import { FORMFIELD, HANKE_TYOMAATYYPPI, HANKE_TYOMAAKOKO } from './types';

const Form3: React.FC<PropTypes> = (props) => {
  const { control, errors } = props;
  const { t } = useTranslation();
  return (
    <div className="form3">
      <H2>{t('hankeForm:tyomaanTiedotForm:header')}</H2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput
            name={FORMFIELD.KATUOSOITE}
            id={FORMFIELD.KATUOSOITE}
            label={t(`hankeForm:labels:${FORMFIELD.KATUOSOITE}`)}
            control={control}
            defaultValue=""
            invalid={!!errors[FORMFIELD.KATUOSOITE]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.TYOMAATYYPPI}
            id={FORMFIELD.TYOMAATYYPPI}
            control={control}
            options={$enum(HANKE_TYOMAATYYPPI).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.TYOMAATYYPPI}:${value}`),
            }))}
            label={t(`hankeForm:labels:${FORMFIELD.TYOMAATYYPPI}`)}
            invalid={!!errors[FORMFIELD.TYOMAATYYPPI]}
            errorMsg={t('hankeForm:insertFieldError')}
            // multiselect todo
          />
        </div>
        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.TYOMAAKOKO}
            id={FORMFIELD.TYOMAAKOKO}
            control={control}
            options={$enum(HANKE_TYOMAAKOKO).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.TYOMAAKOKO}:${value}`),
            }))}
            label={t(`hankeForm:labels:${FORMFIELD.TYOMAAKOKO}`)}
            invalid={!!errors[FORMFIELD.TYOMAAKOKO]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
      </div>
    </div>
  );
};
export default Form3;

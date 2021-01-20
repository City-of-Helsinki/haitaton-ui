import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';
import TextInput from '../../../common/components/textInput/TextInput';
import H2 from '../../../common/components/text/H2';
import { HANKE_TYOMAATYYPPI, HANKE_TYOMAAKOKO } from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';

const Form3: React.FC<FormProps> = ({ formData, control, errors }) => {
  const { t } = useTranslation();
  return (
    <div className="form3">
      <H2>{t('hankeForm:tyomaanTiedotForm:header')}</H2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput required name={FORMFIELD.KATUOSOITE} />
        </div>
        <div className="formWpr">
          <DropdownMultiselect
            name={FORMFIELD.TYOMAATYYPPI}
            id={FORMFIELD.TYOMAATYYPPI}
            control={control}
            options={$enum(HANKE_TYOMAATYYPPI).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.TYOMAATYYPPI}:${value}`),
            }))}
            defaultValue={formData ? (formData[FORMFIELD.TYOMAATYYPPI] as string[]) : []}
            label={t(`hankeForm:labels:${FORMFIELD.TYOMAATYYPPI}`)}
            invalid={!!errors[FORMFIELD.TYOMAATYYPPI]}
            errorMsg={t('hankeForm:insertFieldError')}
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
            defaultValue={formData[FORMFIELD.TYOMAAKOKO] || ''}
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

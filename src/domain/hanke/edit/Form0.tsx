import React, { useState } from 'react';

import { Checkbox } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from '../../../common/components/datePicker/DatePicker';

import { getFormData } from './selectors';

import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';

import PropTypes from './PropTypes';

const Form0: React.FC<PropTypes> = (props) => {
  const { t, i18n } = useTranslation();
  const { control, errors, register } = props;
  const formData = useSelector(getFormData);

  const getHankeenVaiheOptions = [
    {
      value: 'Suunni',
      label: t('hankeForm:perustiedotForm:hankeenVaiheDropDown:suunnittelussa'),
    },
    {
      value: 'Ohjelm',
      label: t('hankeForm:perustiedotForm:hankeenVaiheDropDown:ohjelmointiVaiheessa'),
    },
  ];
  const [ytkChecked, setYtkChecked] = useState(formData?.YTKHanke);

  return (
    <div className="form0">
      <h2>{t('hankeForm:perustiedotForm:header')}</h2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput
            name="hankeenTunnus"
            id="hankeenTunnus"
            label={t('hankeForm:perustiedotForm:hankeenTunnusLabel')}
            control={control}
            defaultValue=""
            invalid={!!errors.hankeenTunnus}
            errorMsg={t('hankeForm:insertFieldError')}
            disabled
          />
        </div>
        <div className="formWpr">
          <h3>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</h3>
          <Checkbox
            name="YTKHanke"
            id="YTKHanke"
            label={t('hankeForm:perustiedotForm:hankeOnYtkHankeLabel')}
            ref={register}
            checked={ytkChecked}
            onChange={() => setYtkChecked(!ytkChecked)}
          />
        </div>
      </div>
      <div className="formWpr">
        <TextInput
          name="hankeenNimi"
          id="hankeenNimi"
          label={t('hankeForm:perustiedotForm:hankeenNimiLabel')}
          control={control}
          rules={{ required: true }}
          defaultValue={formData ? formData.hankeenNimi : ''}
          invalid={!!errors.hankeenNimi}
          errorMsg={t('hankeForm:insertFieldError')}
        />
      </div>
      <div className="calendaraWpr formWpr">
        <div className="left">
          <DatePicker
            name="startDate"
            id="startDate"
            label={t('hankeForm:perustiedotForm:HankkeenAlkupaivaLabel')}
            control={control}
            rules={{ required: true }}
            locale={i18n.language}
            dateFormat="dd.MM.yyyy"
            invalid={!!errors.startDate}
            errorMsg={t('hankeForm:insertFieldError')}
            defaultValue={formData ? formData.startDate : null}
          />
        </div>
        <div className="right">
          <DatePicker
            name="endDate"
            id="endDate"
            label={t('hankeForm:perustiedotForm:HankkeenLoppupaivaLabel')}
            control={control}
            rules={{ required: true }}
            locale={i18n.language}
            dateFormat="dd.MM.yyyy"
            invalid={!!errors.endDate}
            errorMsg={t('hankeForm:insertFieldError')}
            defaultValue={formData ? formData.endDate : null}
          />
        </div>
      </div>
      <div className="formWpr">
        <Dropdown
          name="hankeenVaihe"
          id="hankeenVaihe"
          control={control}
          options={getHankeenVaiheOptions}
          defaultValue={formData?.hankeenVaihe ? formData.hankeenVaihe : null}
          label={t('hankeForm:perustiedotForm:hankeenVaihe')}
          rules={{ required: true }}
          invalid={!!errors.hankeenVaihe}
          errorMsg={t('hankeForm:insertFieldError')}
        />
      </div>
    </div>
  );
};
export default Form0;

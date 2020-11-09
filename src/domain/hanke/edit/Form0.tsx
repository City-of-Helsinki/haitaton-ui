import React, { useState } from 'react';

import { Checkbox } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getFormData } from './selectors';

import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';

import PropTypes from './PropTypes';

const Form0: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  const { control, errors, register } = props;
  const formData = useSelector(getFormData);

  function getHankeenVaiheOptions() {
    return [
      {
        value: 'Suunni',
        label: t('hankeForm:perustiedotForm:hankeenVaiheDropDown:suunnittelussa'),
      },
      {
        value: 'Ohjelm',
        label: t('hankeForm:perustiedotForm:hankeenVaiheDropDown:ohjelmointiVaiheessa'),
      },
    ];
  }

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
        <div className="left">{t('hankeForm:perustiedotForm:HankkeenAlkupaivaLabel')}</div>
        <div className="right">
          <TextInput
            name="endDate"
            id="endDate"
            label={t('hankeForm:perustiedotForm:HankkeenLoppupaivaLabel')}
            control={control}
            rules={{ required: true }}
            invalid={!!errors.endDate}
            errorMsg={t('hankeForm:insertFieldError')}
            defaultValue={formData ? formData.endDate : ''}
          />
        </div>
      </div>
      <div className="formWpr">
        <Dropdown
          name="hankeenVaihe"
          id="hankeenVaihe"
          control={control}
          options={getHankeenVaiheOptions()}
          defaultValue={formData ? formData.hankeenVaihe : undefined}
          label={t('hankeForm:perustiedotForm:hankeenVaihe')}
        />
      </div>
    </div>
  );
};
export default Form0;

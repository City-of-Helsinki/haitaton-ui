import React, { useState } from 'react';

import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import Checkbox from '../../../common/components/checkbox/Checkbox';

import PropTypes from './PropTypes';

const Form0: React.FC<PropTypes> = (props) => {
  const { t } = useTranslation();
  const { changeWizardView, control, errors } = props;

  function getHankeenVaiheOptions() {
    return [
      { value: 'Suunnittelussa', label: 'Suunnittelussa' },
      { value: 'Ohjelmointi', label: 'Ohjelmointi vaiheessa' },
    ];
  }

  const [ytkChecked, setYtkChecked] = useState(false);

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
            control={control}
            invalid={!!errors.hankeenTunnus}
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
          defaultValue=""
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
            defaultValue=""
            invalid={!!errors.endDate}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
      </div>
      <div className="formWpr">
        <Dropdown
          name="hankeenVaihe"
          id="hankeenVaihe"
          control={control}
          options={getHankeenVaiheOptions()}
          defaultValue={getHankeenVaiheOptions()[0]}
          label={t('hankeForm:perustiedotForm:hankeenVaihe')}
        />
      </div>
      <Button type="button" onClick={() => changeWizardView(1)}>
        {t('hankeForm:nextButton')}{' '}
      </Button>
    </div>
  );
};
export default Form0;

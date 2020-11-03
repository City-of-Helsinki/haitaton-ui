import React, { useState, Dispatch, SetStateAction } from 'react';

import { Button } from 'hds-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import Checkbox from '../../../common/components/checkbox/Checkbox';

type Inputs = {
  hankeenTunnus: string;
  hankeenNimi: string;
  hankeenVaihe: string;
  endDate: string;
  omistajaOrganisaatio: string;
  omistajaOsasto: string;
  arvioijaOrganisaatio: string;
  arvioijaOsasto: string;
};

interface IProps {
  changeWizardView: Dispatch<SetStateAction<number>>;
}

const Form0: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { changeWizardView } = props;
  const { handleSubmit, errors, control, getValues } = useForm<Inputs>({
    mode: 'all',
    reValidateMode: 'onBlur',
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const onSubmit = (data: Inputs) => {
    // eslint-disable-next-line
    console.log('data', data);
    // eslint-disable-next-line
    console.log('form values', getValues());
  };

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
      <form name="hanke" onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">validate</button>
      </form>
    </div>
  );
};
export default Form0;

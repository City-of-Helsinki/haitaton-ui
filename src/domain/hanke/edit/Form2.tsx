import React, { Dispatch, SetStateAction } from 'react';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { useForm } from 'react-hook-form';
import TextInput from '../../../common/components/textInput/TextInput';

type Inputs = {
  omistajaOrganisaatio: string;
  omistajaOsasto: string;
  arvioijaOrganisaatio: string;
  arvioijaOsasto: string;
};

interface IProps {
  changeWizardView: Dispatch<SetStateAction<number>>;
}

const Form2: React.FC<IProps> = (props) => {
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
  return (
    <div className="form2">
      <h2>{t('hankeForm:hankkeenYhteystiedotForm:header')}</h2>
      <form name="form2" onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="button" onClick={() => changeWizardView(1)}>
          {t('hankeForm:previousButton')}
        </Button>
        <Button type="button" onClick={() => changeWizardView(3)}>
          {t('hankeForm:nextButton')}{' '}
        </Button>
      </form>
    </div>
  );
};
export default Form2;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Tooltip } from 'hds-react';
import { $enum } from 'ts-enum-util';

import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';

import { FormProps, HANKE_VAIHE, FORMFIELD } from './types';

const Form0: React.FC<FormProps> = ({ control, errors, register, formData }) => {
  const { t, i18n } = useTranslation();
  const [ytkChecked, setYtkChecked] = useState(formData[FORMFIELD.YKT_HANKE] || false);
  return (
    <div className="form0">
      <h2>{t('hankeForm:perustiedotForm:header')}</h2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput
            name={FORMFIELD.TUNNUS}
            id={FORMFIELD.TUNNUS}
            label={t(`hankeForm:labels:${FORMFIELD.TUNNUS}`)}
            control={control}
            defaultValue=""
            invalid={!!errors[FORMFIELD.TUNNUS]}
            errorMsg={t('hankeForm:insertFieldError')}
            disabled
          />
        </div>
        <div className="formWpr">
          <h3 className="labelHeader">
            <div>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</div>
            <Tooltip
              labelText={t(`hankeForm:toolTips:${FORMFIELD.YKT_HANKE}`)}
              openButtonLabelText={t(`hankeForm:toolTips:tipOpenLabel`)}
              closeButtonLabelText={t(`hankeForm:toolTips:tipCloseLabel`)}
            />
          </h3>
          <Checkbox
            name={FORMFIELD.YKT_HANKE}
            id={FORMFIELD.YKT_HANKE}
            label={t(`hankeForm:labels:${FORMFIELD.YKT_HANKE}`)}
            ref={register}
            checked={ytkChecked}
            onChange={() => setYtkChecked(!ytkChecked)}
          />
        </div>
      </div>
      <div className="formWpr">
        <TextInput
          name={FORMFIELD.NIMI}
          id={FORMFIELD.NIMI}
          label={t(`hankeForm:labels:${FORMFIELD.NIMI}`)}
          control={control}
          rules={{ required: true }}
          defaultValue={formData[FORMFIELD.NIMI] || ''}
          invalid={!!errors.hankeenNimi}
          errorMsg={t('hankeForm:insertFieldError')}
          tooltip={{
            labelText: t(`hankeForm:toolTips:${FORMFIELD.NIMI}`),
            openButtonLabelText: t(`hankeForm:toolTips:tipOpenLabel`),
            closeButtonLabelText: t(`hankeForm:toolTips:tipCloseLabel`),
          }}
        />
      </div>
      <div className="calendaraWpr formWpr">
        <div className="left">
          <DatePicker
            name={FORMFIELD.ALKU_PVM}
            id={FORMFIELD.ALKU_PVM}
            label={t(`hankeForm:labels:${FORMFIELD.ALKU_PVM}`)}
            control={control}
            rules={{ required: true }}
            locale={i18n.language}
            dateFormat="dd.MM.yyyy"
            invalid={!!errors.startDate}
            errorMsg={t('hankeForm:insertFieldError')}
            defaultValue={formData[FORMFIELD.ALKU_PVM] || null}
            tooltip={{
              labelText: t(`hankeForm:toolTips:${FORMFIELD.ALKU_PVM}`),
              openButtonLabelText: t(`hankeForm:toolTips:tipOpenLabel`),
              closeButtonLabelText: t(`hankeForm:toolTips:tipCloseLabel`),
            }}
          />
        </div>
        <div className="right">
          <DatePicker
            name={FORMFIELD.LOPPU_PVM}
            id={FORMFIELD.LOPPU_PVM}
            label={t(`hankeForm:labels:${FORMFIELD.LOPPU_PVM}`)}
            control={control}
            rules={{ required: true }}
            locale={i18n.language}
            dateFormat="dd.MM.yyyy"
            invalid={!!errors.endDate}
            errorMsg={t('hankeForm:insertFieldError')}
            defaultValue={formData[FORMFIELD.LOPPU_PVM] || null}
            tooltip={{
              labelText: t(`hankeForm:toolTips:${FORMFIELD.LOPPU_PVM}`),
              openButtonLabelText: t(`hankeForm:toolTips:tipOpenLabel`),
              closeButtonLabelText: t(`hankeForm:toolTips:tipCloseLabel`),
            }}
          />
        </div>
      </div>
      <div className="formWpr">
        <Dropdown
          name={FORMFIELD.VAIHE}
          id={FORMFIELD.VAIHE}
          control={control}
          options={$enum(HANKE_VAIHE).map((value) => ({
            value,
            label: t(`hanke:vaihe:${value}`),
          }))}
          defaultValue={formData[FORMFIELD.VAIHE] || ''}
          label={t(`hankeForm:labels:${FORMFIELD.VAIHE}`)}
          rules={{ required: true }}
          invalid={!!errors[FORMFIELD.VAIHE]}
          errorMsg={t('hankeForm:insertFieldError')}
          tooltip={{
            labelText: t(`hankeForm:toolTips:${FORMFIELD.VAIHE}`),
            openButtonLabelText: t(`hankeForm:toolTips:tipOpenLabel`),
            closeButtonLabelText: t(`hankeForm:toolTips:tipCloseLabel`),
          }}
        />
      </div>
    </div>
  );
};
export default Form0;

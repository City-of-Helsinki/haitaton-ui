import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Tooltip, TextArea } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';

import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';

import { FormProps, HANKE_VAIHE, FORMFIELD, HANKE_SUUNNITTELUVAIHE } from './types';
import H2 from '../../../common/components/text/H2';

const Form0: React.FC<FormProps> = ({ control, errors, register, formData }) => {
  const { t, i18n } = useTranslation();
  const [ytkChecked, setYtkChecked] = useState(formData[FORMFIELD.YKT_HANKE] || false);
  const { getValues } = useFormContext();
  const formValues = getValues();
  return (
    <div className="form0">
      <H2>{t('hankeForm:perustiedotForm:header')}</H2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput
            name={FORMFIELD.TUNNUS}
            id={FORMFIELD.TUNNUS}
            label={t(`hankeForm:labels:${FORMFIELD.TUNNUS}`)}
            control={control}
            defaultValue={formData[FORMFIELD.TUNNUS] || ''}
            disabled
          />
        </div>
        <div className="formWpr">
          <h3 className="labelHeader">
            <div>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</div>
            <Tooltip tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}>
              {t(`hankeForm:toolTips:${FORMFIELD.YKT_HANKE}`)}
            </Tooltip>
          </h3>
          <Checkbox
            name={FORMFIELD.YKT_HANKE}
            id={FORMFIELD.YKT_HANKE}
            label={t(`hankeForm:labels:${FORMFIELD.YKT_HANKE}`)}
            ref={register}
            checked={ytkChecked}
            onChange={() => setYtkChecked(!ytkChecked)}
            data-testid={FORMFIELD.YKT_HANKE}
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
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.NIMI}`),
            buttonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            placement: 'auto',
          }}
        />
      </div>
      <div className="formWpr">
        <TextArea
          id={FORMFIELD.KUVAUS}
          name={FORMFIELD.KUVAUS}
          label={t(`hankeForm:labels:${FORMFIELD.KUVAUS}`)}
          defaultValue={formData[FORMFIELD.KUVAUS] || ''}
          invalid={!!errors[FORMFIELD.KUVAUS]}
          ref={register({ required: true })}
          tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}
          tooltipText={t(`hankeForm:toolTips:${FORMFIELD.KUVAUS}`)}
          data-testid={FORMFIELD.KUVAUS}
        />
        {!!errors[FORMFIELD.KUVAUS] && (
          <span className="error-text">{t('hankeForm:insertFieldError')}</span>
        )}
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
              tooltipText: t(`hankeForm:toolTips:${FORMFIELD.ALKU_PVM}`),
              buttonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
              placement: 'auto',
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
              tooltipText: t(`hankeForm:toolTips:${FORMFIELD.LOPPU_PVM}`),
              buttonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
              placement: 'auto',
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
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.VAIHE}`),
            tooltipLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            placement: 'auto',
          }}
        />
      </div>
      <div className="formWpr">
        <Dropdown
          name={FORMFIELD.SUUNNITTELUVAIHE}
          id={FORMFIELD.SUUNNITTELUVAIHE}
          control={control}
          options={$enum(HANKE_SUUNNITTELUVAIHE).map((value) => ({
            value,
            label: t(`hanke:suunnitteluVaihe:${value}`),
          }))}
          defaultValue={formData[FORMFIELD.SUUNNITTELUVAIHE] || null}
          label={t(`hankeForm:labels:${FORMFIELD.SUUNNITTELUVAIHE}`)}
          invalid={!!errors[FORMFIELD.SUUNNITTELUVAIHE]}
          errorMsg={t('hankeForm:insertFieldError')}
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.SUUNNITTELUVAIHE}`),
            tooltipLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            placement: 'auto',
          }}
          disabled={formValues.vaihe !== 'SUUNNITTELU'}
        />
      </div>
    </div>
  );
};
export default Form0;

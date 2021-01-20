import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Tooltip, TextArea } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import { HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE } from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';
import H2 from '../../../common/components/text/H2';

const Form0: React.FC<FormProps> = ({ control, errors, register, formData }) => {
  const { t, i18n } = useTranslation();
  const [ytkChecked, setYtkChecked] = useState(formData[FORMFIELD.YKT_HANKE] || false);
  const { watch } = useFormContext();

  // Subscribe to vaihe changes
  const watchFields = watch([FORMFIELD.VAIHE]);

  return (
    <div className="form0">
      <H2 data-testid="form0Header">{t('hankeForm:perustiedotForm:header')}</H2>
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput name={FORMFIELD.TUNNUS} disabled />
        </div>
        <div className="formWpr">
          <h3 className="labelHeader">
            <div>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</div>
            <Tooltip tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}>
              {t(`hankeForm:toolTips:${FORMFIELD.YKT_HANKE}`)}
            </Tooltip>
          </h3>
          <Checkbox
            id={FORMFIELD.YKT_HANKE}
            name={FORMFIELD.YKT_HANKE}
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
          required
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.NIMI}`),
            tooltipButtonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
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
          ref={register()}
          tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}
          tooltipText={t(`hankeForm:toolTips:${FORMFIELD.KUVAUS}`)}
          data-testid={FORMFIELD.KUVAUS}
          required
        />
        {!!errors[FORMFIELD.KUVAUS] && (
          <span className="error-text">{t('hankeForm:insertFieldError')}</span>
        )}
      </div>
      <div className="calendaraWpr formWpr">
        <div className="left">
          <DatePicker
            name={FORMFIELD.ALKU_PVM}
            label={t(`hankeForm:labels:${FORMFIELD.ALKU_PVM}`)}
            dateFormat="dd.MM.yyyy"
            defaultValue={formData[FORMFIELD.ALKU_PVM] || null}
            locale={i18n.language}
            required
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
            label={t(`hankeForm:labels:${FORMFIELD.LOPPU_PVM}`)}
            dateFormat="dd.MM.yyyy"
            defaultValue={formData[FORMFIELD.LOPPU_PVM] || null}
            locale={i18n.language}
            required
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
          id={FORMFIELD.VAIHE}
          name={FORMFIELD.VAIHE}
          control={control}
          options={$enum(HANKE_VAIHE).map((value) => ({
            value,
            label: t(`hanke:vaihe:${value}`),
          }))}
          defaultValue={formData[FORMFIELD.VAIHE] || ''}
          label={t(`hankeForm:labels:${FORMFIELD.VAIHE}`)}
          invalid={!!errors[FORMFIELD.VAIHE]}
          errorMsg={t('hankeForm:insertFieldError')}
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.VAIHE}`),
            tooltipLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            placement: 'auto',
          }}
          required
        />
      </div>
      <div className="formWpr">
        <Dropdown
          id={FORMFIELD.SUUNNITTELUVAIHE}
          name={FORMFIELD.SUUNNITTELUVAIHE}
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
          disabled={watchFields[FORMFIELD.VAIHE] !== HANKE_VAIHE.SUUNNITTELU}
          required={watchFields[FORMFIELD.VAIHE] === HANKE_VAIHE.SUUNNITTELU}
        />
      </div>
    </div>
  );
};
export default Form0;

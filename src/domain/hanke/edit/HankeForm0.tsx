import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Tooltip, TextArea } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import {
  HANKE_VAIHE,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_TYOMAATYYPPI,
  HANKE_TYOMAAKOKO,
} from '../../types/hanke';
import Text from '../../../common/components/text/Text';
import { FORMFIELD, FormProps } from './types';
import { useFormPage } from './hooks/useFormPage';
import EditDisabledNotification from './components/EditDisabledNotification';
import useLocale from '../../../common/hooks/useLocale';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';

const Form0: React.FC<FormProps> = ({ control, errors, register, formData }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [ytkChecked, setYtkChecked] = useState(formData[FORMFIELD.YKT_HANKE] || false);
  const { watch } = useFormContext();
  useFormPage();

  // Subscribe to vaihe changes
  const watchFields = watch([FORMFIELD.VAIHE]);

  return (
    <div className="form0">
      <Text tag="h2" spacing="s" weight="bold">
        {t('hankeForm:perustiedotForm:header')}
      </Text>
      <EditDisabledNotification formData={formData} />
      <div className="dataWpr">
        <div className="formWpr">
          <TextInput name={FORMFIELD.TUNNUS} disabled />
        </div>
      </div>
      <div className="formWpr">
        <TextInput name={FORMFIELD.NIMI} required />
      </div>
      <div className="formWpr">
        <TextArea
          id={FORMFIELD.KUVAUS}
          name={FORMFIELD.KUVAUS}
          label={t(`hankeForm:labels:${FORMFIELD.KUVAUS}`)}
          defaultValue={formData[FORMFIELD.KUVAUS] || ''}
          invalid={!!errors[FORMFIELD.KUVAUS]}
          ref={register()}
          data-testid={FORMFIELD.KUVAUS}
          required
        />
        {!!errors[FORMFIELD.KUVAUS] && (
          <span className="error-text">{t('hankeForm:insertFieldError')}</span>
        )}
      </div>
      <div className="formWpr">
        <TextInput
          required
          name={FORMFIELD.KATUOSOITE}
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.KATUOSOITE}`),
            tooltipButtonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            placement: 'auto',
          }}
        />
      </div>
      <div className="calendaraWpr formWpr">
        <div className="left">
          <DatePicker
            name={FORMFIELD.ALKU_PVM}
            label={t(`hankeForm:labels:${FORMFIELD.ALKU_PVM}`)}
            dateFormat="dd.MM.yyyy"
            defaultValue={formData[FORMFIELD.ALKU_PVM] || null}
            locale={locale}
            required
          />
        </div>
        <div className="right">
          <DatePicker
            name={FORMFIELD.LOPPU_PVM}
            label={t(`hankeForm:labels:${FORMFIELD.LOPPU_PVM}`)}
            dateFormat="dd.MM.yyyy"
            defaultValue={formData[FORMFIELD.LOPPU_PVM] || null}
            locale={locale}
            required
          />
        </div>
      </div>
      <div className="form3">
        <div className="dataWpr">
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
          disabled={watchFields[FORMFIELD.VAIHE] !== HANKE_VAIHE.SUUNNITTELU}
          required={watchFields[FORMFIELD.VAIHE] === HANKE_VAIHE.SUUNNITTELU}
        />
      </div>
      <div className="formWpr">
        <br />
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
  );
};
export default Form0;

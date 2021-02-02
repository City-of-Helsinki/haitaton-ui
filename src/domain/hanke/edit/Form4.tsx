import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import H2 from '../../../common/components/text/H2';
import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYAITTA,
  HANKE_TARINAHAITTA,
} from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';
import { useFormPage } from './hooks/useFormPage';

const Form4: React.FC<FormProps> = ({ control, errors, formData }) => {
  const { t, i18n } = useTranslation();
  useFormPage();
  return (
    <div className="form4">
      <H2>{t('hankeForm:hankkeenHaitatForm:header')}</H2>
      <div className="dataWpr">
        <div className="calendaraWpr formWpr">
          <div className="left">
            <DatePicker
              name={FORMFIELD.HAITTA_ALKU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_ALKU_PVM}`)}
              dateFormat="dd.MM.yyyy"
              defaultValue={formData[FORMFIELD.HAITTA_ALKU_PVM] || null}
              locale={i18n.language}
            />
          </div>
          <div className="right">
            <DatePicker
              name={FORMFIELD.HAITTA_LOPPU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
              dateFormat="dd.MM.yyyy"
              defaultValue={formData[FORMFIELD.HAITTA_LOPPU_PVM] || null}
              locale={i18n.language}
            />
          </div>
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.KAISTAHAITTA}
            id={FORMFIELD.KAISTAHAITTA}
            control={control}
            options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.KAISTAHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}
            invalid={!!errors[FORMFIELD.KAISTAHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.KAISTAPITUUSHAITTA}
            id={FORMFIELD.KAISTAPITUUSHAITTA}
            control={control}
            options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.KAISTAPITUUSHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}
            invalid={!!errors[FORMFIELD.KAISTAPITUUSHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.MELUHAITTA}
            id={FORMFIELD.MELUHAITTA}
            control={control}
            options={$enum(HANKE_MELUHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.MELUHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.MELUHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}
            invalid={!!errors[FORMFIELD.MELUHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.POLYHAITTA}
            id={FORMFIELD.POLYHAITTA}
            control={control}
            options={$enum(HANKE_POLYAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.POLYHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.POLYHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}
            invalid={!!errors[FORMFIELD.POLYHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.TARINAHAITTA}
            id={FORMFIELD.TARINAHAITTA}
            control={control}
            options={$enum(HANKE_TARINAHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.TARINAHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.TARINAHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}
            invalid={!!errors[FORMFIELD.TARINAHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
      </div>
    </div>
  );
};
export default Form4;

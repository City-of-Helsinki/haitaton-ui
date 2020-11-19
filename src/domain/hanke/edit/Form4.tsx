import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import H2 from '../../../common/components/text/H2';
import PropTypes from './PropTypes';
import {
  FORMFIELD,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYAITTA,
  HANKE_TARINAHAITTA,
} from './types';
import { getFormData } from './selectors';

const Form4: React.FC<PropTypes> = (props) => {
  const { t, i18n } = useTranslation();
  const { control, errors } = props;
  const formData = useSelector(getFormData);

  return (
    <div className="form4">
      <H2>{t('hankeForm:hankkeenHaitatForm:header')}</H2>
      <div className="dataWpr">
        <div className="calendaraWpr formWpr">
          <div className="left">
            <DatePicker
              name={FORMFIELD.HAITTA_ALKU_PVM}
              id={FORMFIELD.HAITTA_ALKU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_ALKU_PVM}`)}
              control={control}
              rules={{ required: true }}
              locale={i18n.language}
              dateFormat="dd.MM.yyyy"
              invalid={!!errors[FORMFIELD.HAITTA_ALKU_PVM]}
              errorMsg={t('hankeForm:insertFieldError')}
              defaultValue={formData ? formData[FORMFIELD.HAITTA_ALKU_PVM] : null}
            />
          </div>
          <div className="right">
            <DatePicker
              name={FORMFIELD.HAITTA_LOPPU_PVM}
              id={FORMFIELD.HAITTA_LOPPU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
              control={control}
              rules={{ required: true }}
              locale={i18n.language}
              dateFormat="dd.MM.yyyy"
              invalid={!!errors[FORMFIELD.HAITTA_LOPPU_PVM]}
              errorMsg={t('hankeForm:insertFieldError')}
              defaultValue={formData ? formData[FORMFIELD.HAITTA_LOPPU_PVM] : null}
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
            defaultValue={
              !formData[FORMFIELD.KAISTAHAITTA] ? formData[FORMFIELD.KAISTAHAITTA] : null
            }
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}
            rules={{ required: true }}
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
            defaultValue={
              !formData[FORMFIELD.KAISTAPITUUSHAITTA]
                ? formData[FORMFIELD.KAISTAPITUUSHAITTA]
                : null
            }
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}
            rules={{ required: true }}
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
            defaultValue={!formData[FORMFIELD.MELUHAITTA] ? formData[FORMFIELD.MELUHAITTA] : null}
            label={t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}
            rules={{ required: true }}
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
            defaultValue={!formData[FORMFIELD.POLYHAITTA] ? formData[FORMFIELD.POLYHAITTA] : null}
            label={t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}
            rules={{ required: true }}
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
            defaultValue={
              !formData[FORMFIELD.TARINAHAITTA] ? formData[FORMFIELD.TARINAHAITTA] : null
            }
            label={t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}
            rules={{ required: true }}
            invalid={!!errors[FORMFIELD.TARINAHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
          />
        </div>
      </div>
    </div>
  );
};
export default Form4;

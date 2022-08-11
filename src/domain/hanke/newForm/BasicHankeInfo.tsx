import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, TextArea, TextInput, DateInput, Select, Tooltip } from 'hds-react';
import { $enum } from 'ts-enum-util';
import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  HakemusFormValues,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_SUUNNITTELUVAIHE_KEY,
  HANKE_VAIHE,
  HANKE_VAIHE_KEY,
  Option,
} from './types';
import {
  convertFinnishDate,
  formatToFinnishDate,
  toEndOfDayUTCISO,
  toStartOfDayUTCISO,
} from '../../../common/utils/date';
import yup from '../../../common/utils/yup';
import Text from '../../../common/components/text/Text';
import './NewHankeForm.styles.scss';

// TODO: add validation error messages
// TODO: go through dynamic form example and see what is missing
// TODO: date input min and max validation based on set dates

export const today = startOfDay(new Date());

export const validationSchema = {
  nimi: Yup.string().required('Hankkeella tulee olla nimi'),
  kuvaus: Yup.string().required('Hankkeella tulee olla kuvaus'),
  alkuPvm: Yup.date().nullable().required('Hankkeella tulee olla aloituspäivämäärä'),
  loppuPvm: Yup.date().required('Hankkeella tulee olla päättymispäivämäärä'),
  vaihe: Yup.mixed()
    .required('Hankkeen vaihe pitää olla asetettu')
    .oneOf($enum(HANKE_VAIHE).getValues()),
  suunnitteluVaihe: Yup.mixed()
    .nullable()
    .when(['vaihe'], { is: HANKE_VAIHE.SUUNNITTELU, then: yup.string().required() }),
};

export interface InitialValueTypes {
  id: number | null;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY | '';
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
}

export const initialValues: InitialValueTypes = {
  id: null,
  hankeTunnus: '',
  onYKTHanke: false,
  nimi: '',
  kuvaus: '',
  alkuPvm: '',
  loppuPvm: '',
  vaihe: '',
  suunnitteluVaihe: null,
};

export const BasicHankeInfo: React.FC = () => {
  const { t } = useTranslation();
  const formik = useFormikContext<HakemusFormValues>();
  const alkuPvmInputIsDirty = useRef(false);
  const loppuPvmInputIsDirty = useRef(false);
  const getErrorMessage = (fieldname: keyof typeof initialValues) =>
    formik.touched[fieldname] ? formik.errors[fieldname] : undefined;
  return (
    <div>
      <Text tag="h1" spacing="s" weight="bold" styleAs="h3">
        {t('hankeForm:perustiedotForm:header')}
      </Text>
      <TextInput
        className="mb-m"
        id="hankeTunnus"
        label="Hankkeen tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.hankeTunnus}
        disabled
      />
      <TextInput
        className="mb-m"
        id="nimi"
        label="Hankkeen nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.nimi}
        errorText={getErrorMessage('nimi')}
        required
      />
      <TextArea
        className="mb-m"
        id="kuvaus"
        label="Hankkeen kuvaus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.kuvaus}
        errorText={getErrorMessage('kuvaus')}
        required
      />
      <div className="two-col mb-m">
        <DateInput
          className="mr-l"
          id="alkuPvm"
          name="alkuPvm"
          label="Hankkeen alkupäivä"
          minDate={new Date()}
          onChange={(date: string) => {
            const convertedDateString = convertFinnishDate(date);
            if (convertedDateString.length > 0) {
              formik.setFieldValue(
                'alkuPvm',
                toStartOfDayUTCISO(new Date(convertedDateString)) || ''
              );
            }
            alkuPvmInputIsDirty.current = true;
          }}
          onBlur={() => {
            if (alkuPvmInputIsDirty.current) {
              formik.handleBlur({ target: { name: 'alkuPvm' } });
            }
          }}
          value={!formik.values.alkuPvm ? undefined : formatToFinnishDate(formik.values.alkuPvm)}
          required
          errorText={getErrorMessage('alkuPvm')}
        />
        <DateInput
          id="loppuPvm"
          name="loppuPvm"
          label="Hankkeen loppupäivä"
          minDate={formik.values.alkuPvm !== '' ? new Date(formik.values.alkuPvm) : new Date()}
          onChange={(date: string) => {
            const convertedDateString = convertFinnishDate(date);
            if (convertedDateString.length > 0) {
              formik.setFieldValue(
                'loppuPvm',
                toEndOfDayUTCISO(new Date(convertedDateString)) || ''
              );
            }
            loppuPvmInputIsDirty.current = true;
          }}
          onBlur={() => {
            if (loppuPvmInputIsDirty.current) {
              formik.handleBlur({ target: { name: 'loppuPvm' } });
            }
          }}
          value={!formik.values.loppuPvm ? undefined : formatToFinnishDate(formik.values.loppuPvm)}
          required
          errorText={getErrorMessage('loppuPvm')}
        />
      </div>
      <div className="select-container">
        <Tooltip tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)} className="select-tooltip">
          {t(`hankeForm:toolTips:vaihe`)}
        </Tooltip>
        <Select
          className="mb-m"
          required
          label="Hankkeen vaihe"
          options={$enum(HANKE_VAIHE).map((value) => ({
            value,
            label: t(`hanke:vaihe:${value}`),
          }))}
          onChange={(selection: Option) => {
            if (selection.value !== HANKE_VAIHE.SUUNNITTELU) {
              formik.setFieldValue('suunnitteluVaihe', null);
            }
            formik.setFieldValue('vaihe', selection.value);
          }}
          value={{
            value: formik.values.vaihe,
            label: formik.values.vaihe ? t(`hanke:vaihe:${formik.values.vaihe}`) : '',
          }}
          error={getErrorMessage('vaihe')}
          invalid={!!getErrorMessage('vaihe')}
        />
      </div>
      <Select
        className="mb-l"
        label="Hankkeen suunnitteluvaihe"
        disabled={HANKE_VAIHE.SUUNNITTELU !== formik.values.vaihe}
        options={$enum(HANKE_SUUNNITTELUVAIHE).map((value) => ({
          value,
          label: t(`hanke:suunnitteluVaihe:${value}`),
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue('suunnitteluVaihe', selection.value);
        }}
        value={{
          value: formik.values.suunnitteluVaihe ? formik.values.suunnitteluVaihe : '',
          label: formik.values.suunnitteluVaihe
            ? t(`hanke:suunnitteluVaihe:${formik.values.suunnitteluVaihe}`)
            : '',
        }}
      />

      <div>
        <div className="ytk-info-container">
          <p className="mr-xs">{t('hankeForm:perustiedotForm:ytkHankeHeader')}</p>
          <Tooltip tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}>
            {t(`hankeForm:toolTips:onYKTHanke`)}
          </Tooltip>
        </div>
        <Checkbox
          id="onYKTHanke"
          name="onYKTHanke"
          label="Hanke on YKT-hanke"
          checked={formik.values.onYKTHanke === true}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
    </div>
  );
};

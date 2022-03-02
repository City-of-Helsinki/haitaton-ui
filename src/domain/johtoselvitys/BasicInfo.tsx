import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, TextArea, TextInput, DateInput, Select } from 'hds-react';
import { $enum } from 'ts-enum-util';
import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import { HANKE_SUUNNITTELUVAIHE_KEY, HANKE_VAIHE, HANKE_VAIHE_KEY } from '../hanke/newForm/types';
import { convertFinnishDate, toStartOfDayUTCISO } from '../../common/utils/date';
import yup from '../../common/utils/yup';
import { JohtoselvitysFormValues } from './types';

// TODO: add tooltips
// TODO: add validation error messages
// TODO: go through dynamic form example and see what is missing
// TODO: date input min and max validation based on set dates

export const today = startOfDay(new Date());

export const validationSchema = {
  nimi: Yup.string().required('Please enter a name for the hanke'),
  kuvaus: Yup.string().required('Please enter a kuvaus for the hanke'),
  alkuPvm: Yup.date().required('Hankkeella tulee olla aloituspäivämäärä').min(7),
  loppuPvm: Yup.date().required('Hankkeella tulee olla päättymispäivämäärä'),
  vaihe: Yup.mixed().required().oneOf($enum(HANKE_VAIHE).getValues()),
  suunnitteluVaihe: Yup.mixed()
    .nullable()
    .when(['vaihe'], { is: HANKE_VAIHE.SUUNNITTELU, then: yup.string().required() }),
};

export interface types {
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

export const initialValues: types = {
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

type Option = { value: string; label: string };

export const BasicHankeInfo: React.FC = () => {
  const formik = useFormikContext<JohtoselvitysFormValues>();
  const alkuPvmInputIsDirty = useRef(false);
  return (
    <div>
      <p>{JSON.stringify(formik.errors)}</p>
      <Select
        required
        label="Tyyppi"
        disabled
        options={[]}
        onChange={(selection: Option) => {
          console.log('Changed option');
          console.log(selection);
          formik.setFieldValue('applicationType', selection.value);
        }}
      />
      <Select
        required
        label="Liittyvä hanke"
        disabled
        options={[]}
        onChange={(selection: Option) => {
          console.log('Changed option');
          console.log(selection);
          formik.setFieldValue('applicationType', selection.value);
        }}
      />
      <TextInput
        id="nimi"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.name}
        disabled
      />
      <TextInput
        id="id"
        label="Hakemustunnus"
        disabled
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.id?.toString()}
      />

      <TextArea
        id="kuvaus"
        label="Kuvaus"
        placeholder="name"
        helperText="Hankkeen kuvaus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.workDescription}
      />
      <DateInput
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
        value={!formik.values.applicationData.startTime ? undefined : '1234'}
        required
      />
      <Checkbox
        id="applicationData.maintenanceWork"
        name="applicationData.maintenanceWork"
        label="Uuden rakenteen tai johdon rakentamisesta"
        checked={formik.values.applicationData.maintenanceWork === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </div>
  );
};

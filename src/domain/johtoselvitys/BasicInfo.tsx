import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, TextArea, TextInput, DateInput, Select } from 'hds-react';
import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import { convertFinnishDate, toStartOfDayUTCISO } from '../../common/utils/date';
import { ApplicationType, JohtoselvitysFormValues } from './types';

// TODO: add tooltips
// TODO: add validation error messages
// TODO: go through dynamic form example and see what is missing
// TODO: date input min and max validation based on set dates

export const today = startOfDay(new Date());

export const validationSchema = {
  name: Yup.string().required('Lisää nimi'),
  startTime: Yup.string().required('Lisää aloituspäivä'),
  endTime: Yup.string().required('Lisää lopetuspäivä'),
  identificationNumber: Yup.string().required('Lisää liittyvä hanke'),
  workDescription: Yup.string().required('Lisää työnkuvaus'),
};

export interface InitialValueTypes {
  applicationType: ApplicationType;
  applicationData: {
    name: string;
    startTime: number | null;
    endTime: number | null;
    identificationNumber: string; // hankeTunnus
    clientApplicationKind: string;
    workDescription: string;
    constructionWork: boolean;
    maintenanceWork: boolean;
    emergencyWork: boolean;
    propertyConnectivity: boolean;
  };
}

export const initialValues: InitialValueTypes = {
  applicationType: 'CABLE_REPORT',
  applicationData: {
    name: '',
    startTime: null,
    endTime: null,
    identificationNumber: '',
    clientApplicationKind: '',
    workDescription: '',
    constructionWork: false,
    maintenanceWork: false,
    emergencyWork: false,
    propertyConnectivity: false,
  },
};

type Option = { value: string; label: string };

export const BasicHankeInfo: React.FC = () => {
  const formik = useFormikContext<JohtoselvitysFormValues>();
  const startTimeInputIsDirty = useRef(false);
  const endTimeInputIsDirty = useRef(false);
  return (
    <div>
      <Select
        required
        label="Tyyppi"
        defaultValue={{ value: 'CABLE_APPLICATION', label: 'Johtoselvityshakemus' }}
        value={{ value: 'CABLE_APPLICATION', label: 'Johtoselvityshakemus' }}
        options={[{ value: 'CABLE_APPLICATION', label: 'Johtoselvityshakemus' }]}
        onChange={(selection: Option) => {
          formik.setFieldValue('applicationType', selection.value);
        }}
      />
      {/* TODO: HAI-1160 */}
      <Select
        required
        label="Liittyvä hanke"
        options={[]}
        disabled
        onChange={(selection: Option) => {
          formik.setFieldValue('applicationData.identificationNumber', selection.value);
        }}
      />
      <TextInput
        id="applicationData.name"
        label="Nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.name}
      />
      <TextInput
        id="applicationData.id"
        label="Hakemustunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.id?.toString()}
        defaultValue={formik.values.id?.toString()}
        disabled
      />
      <TextArea
        id="applicationData.workDescription"
        label="Kuvaus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.applicationData.workDescription}
      />
      <DateInput
        id="applicationData.startTime"
        name="applicationData.startTime"
        label="Aloituspäivä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);

          if (convertedDateString.length > 0) {
            // TODO convert to unix timestamp
            formik.setFieldValue(
              'applicationData.startTime',
              toStartOfDayUTCISO(new Date(convertedDateString)) || ''
            );
          }
          startTimeInputIsDirty.current = true;
        }}
        onBlur={() => {
          if (startTimeInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'applicationData.startTime' } });
          }
        }}
        required
      />
      <DateInput
        id="applicationData.endTime"
        name="applicationData.endTime"
        label="Lopetuspäivä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);

          if (convertedDateString.length > 0) {
            // TODO convert to unix timestamp
            formik.setFieldValue(
              'applicationData.endTime',
              toStartOfDayUTCISO(new Date(convertedDateString)) || ''
            );
          }
          endTimeInputIsDirty.current = true;
        }}
        onBlur={() => {
          if (endTimeInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'applicationData.endTime' } });
          }
        }}
        required
      />
      <br />
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>Työssä on kyse:</div>
      <Checkbox
        id="applicationData.constructionWork"
        name="applicationData.constructionWork"
        label="Uuden rakenteen tai johdon rakentamisesta"
        checked={formik.values.applicationData.constructionWork === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Checkbox
        id="applicationData.maintenanceWork"
        name="applicationData.maintenanceWork"
        label="Olemassaolevan rakenteen kunnossapitotyöstä"
        checked={formik.values.applicationData.maintenanceWork === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Checkbox
        id="applicationData.propertyConnectivity"
        name="applicationData.propertyConnectivity"
        label="Kiinteistöliittymien rakentamisesta"
        checked={formik.values.applicationData.propertyConnectivity === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Checkbox
        id="applicationData.emergencyWork"
        name="applicationData.emergencyWork"
        label="Kaivutyö on aloitettu jo ennen johtoselvityksen tilaamista merkittävien vahinkojen estämiseksi (hätätyön luonteinen työ)"
        checked={formik.values.applicationData.emergencyWork === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </div>
  );
};

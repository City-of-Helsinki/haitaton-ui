import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Coordinate } from 'ol/coordinate';
import HankeDrawer from '../../map/components/HankeDrawer/HankeDrawerContainer';
import { useFormPage } from './hooks/useFormPage';
import { FORMFIELD, FormProps } from './types';
import DatePicker from '../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import useLocale from '../../../common/hooks/useLocale';
import {
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
} from '../../types/hanke';
import { HankeGeoJSON } from '../../../common/types/hanke';
import { doAddressSearch } from '../../map/utils';

const Form1: React.FC<FormProps> = ({ errors, formData }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const instructions = t('hankeForm:hankkeenAlueForm:instructions').split('\n');
  const { setValue } = useFormContext();
  const [addressCoordinate, setAddressCoordinate] = useState<Coordinate | undefined>();
  useFormPage();

  const handleGeometriesChange = useCallback(
    (geometry: HankeGeoJSON) => {
      setValue(FORMFIELD.GEOMETRIES_CHANGED, true, { shouldDirty: true });
      setValue(FORMFIELD.GEOMETRIAT, geometry);
    },
    [setValue]
  );

  useEffect(() => {
    if (formData.tyomaaKatuosoite) {
      doAddressSearch(formData.tyomaaKatuosoite).then(({ data }) => {
        setAddressCoordinate(data.features[0]?.geometry.coordinates);
      });
    }
  }, [formData.tyomaaKatuosoite]);

  return (
    <div className="form1">
      <Accordion
        heading="Ohjeet alueen piirtämiseen"
        theme={{
          '--header-font-size': 'var(--fontsize-heading-s)',
          '--border-color': 'var(--white)',
        }}
        initiallyOpen
      >
        {instructions.map((instruction) => (
          <p key={instruction}>{instruction}</p>
        ))}
      </Accordion>
      <br />
      <div style={{ position: 'relative' }}>
        <HankeDrawer
          onChangeGeometries={handleGeometriesChange}
          hankeTunnus={formData.hankeTunnus}
          center={addressCoordinate}
        />
      </div>

      <div>
        <br />
        <br />
        <div className="calendaraWpr formWpr">
          <div className="left">
            <DatePicker
              name={FORMFIELD.HAITTA_ALKU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_ALKU_PVM}`)}
              locale={locale}
              required
            />
          </div>
          <div className="right">
            <DatePicker
              name={FORMFIELD.HAITTA_LOPPU_PVM}
              label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
              locale={locale}
              required
            />
          </div>
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.KAISTAHAITTA}
            id={FORMFIELD.KAISTAHAITTA}
            options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.KAISTAHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}
            invalid={!!errors[FORMFIELD.KAISTAHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
            required
            tooltip={{
              tooltipText: t(`hankeForm:toolTips:${FORMFIELD.KAISTAHAITTA}`),
              tooltipButtonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
              placement: 'auto',
            }}
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.KAISTAPITUUSHAITTA}
            id={FORMFIELD.KAISTAPITUUSHAITTA}
            options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${value}`),
            }))}
            defaultValue={formData[FORMFIELD.KAISTAPITUUSHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}
            invalid={!!errors[FORMFIELD.KAISTAPITUUSHAITTA]}
            errorMsg={t('hankeForm:insertFieldError')}
            required
          />
        </div>

        <div className="formWpr">
          <Dropdown
            name={FORMFIELD.MELUHAITTA}
            id={FORMFIELD.MELUHAITTA}
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
            options={$enum(HANKE_POLYHAITTA).map((value) => ({
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
export default Form1;

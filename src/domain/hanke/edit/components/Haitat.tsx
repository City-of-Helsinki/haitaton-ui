import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Fieldset, IconCross, IconTrash } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Spacer } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { FORMFIELD, HankeDataFormState } from '../types';
import DatePicker from '../../../../common/components/datePicker/DatePicker';
import Dropdown from '../../../../common/components/dropdown/Dropdown';
import useLocale from '../../../../common/hooks/useLocale';
import {
  HankeAlue,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
} from '../../../types/hanke';
import styles from './Haitat.module.scss';
import TextInput from '../../../../common/components/textInput/TextInput';
import {
  getHankealueDateLimits,
  getApplicationsInsideHankealue,
  getAreaDefaultName,
} from '../utils';
import ConfirmationDialog from '../../../../common/components/HDSConfirmationDialog/ConfirmationDialog';
import { useApplicationsForHanke } from '../../../application/hooks/useApplications';

type Props = {
  index: number;
  onRemoveArea: (index: number) => void;
  onChangeArea: (hankeAlue: HankeAlue) => void;
};

const Haitat: React.FC<Props> = ({ index, onRemoveArea, onChangeArea }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { getValues, watch, setValue } = useFormContext<HankeDataFormState>();
  const hanketunnus = getValues(FORMFIELD.TUNNUS);
  const formValues: HankeAlue[] = getValues(FORMFIELD.HANKEALUEET) as HankeAlue[];

  const watchHankeAlue = watch(`${FORMFIELD.HANKEALUEET}.${index}`) as HankeAlue;
  const haittaAlkuPvm = watchHankeAlue.haittaAlkuPvm;
  const haittaLoppuPvm = watchHankeAlue.haittaLoppuPvm;

  const [areaToRemove, setAreaToRemove] = useState<number | null>(null);
  const [cannotRemoveArea, setCannotRemoveArea] = useState(false);

  const areaDefaultName = useMemo(
    () => getAreaDefaultName(getValues(FORMFIELD.HANKEALUEET)),
    [getValues],
  );

  const { data: hankkeenHakemukset } = useApplicationsForHanke(hanketunnus, true);
  const hakemukset = hankkeenHakemukset?.applications || [];
  const applicationsInsideHankealue = getApplicationsInsideHankealue(watchHankeAlue, hakemukset);
  const hasApplicationAreasInsideHankeArea = applicationsInsideHankealue.length > 0;

  const [maxStartDate, minEndDate] = getHankealueDateLimits(
    haittaAlkuPvm,
    applicationsInsideHankealue,
  );

  useEffect(() => {
    if (haittaAlkuPvm && haittaLoppuPvm && haittaAlkuPvm > haittaLoppuPvm) {
      setValue(`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`, haittaAlkuPvm);
    }
  }, [haittaAlkuPvm, haittaLoppuPvm, index, setValue]);

  function confirmRemoveArea() {
    if (areaToRemove !== null) {
      onRemoveArea(areaToRemove);
      setAreaToRemove(null);
    }
  }

  function closeAreaRemoveDialog() {
    setAreaToRemove(null);
  }

  function closeCannotRemoveAreaDialog() {
    setCannotRemoveArea(false);
  }

  const handleNuisancesChange = debounce(
    () => {
      onChangeArea(watchHankeAlue);
    },
    300,
    { leading: true, trailing: false },
  );

  return (
    <>
      <Fieldset
        heading={t('hankeForm:hankkeenAlueForm:haitatHeader')}
        border
        className={styles.haitatContainer}
      >
        <div className={`${styles.formRow} ${styles.formRowEven} ${styles.formRowReverse}`}>
          <Button
            variant="secondary"
            theme="black"
            iconLeft={<IconCross />}
            onClick={() =>
              hasApplicationAreasInsideHankeArea
                ? setCannotRemoveArea(true)
                : setAreaToRemove(index)
            }
          >
            {t('hankeForm:hankkeenAlueForm:removeAreaButton')}
          </Button>
          <Spacer />
          <TextInput
            name={`${FORMFIELD.HANKEALUEET}.${index}.nimi`}
            label={t('form:labels:areaName')}
            helperText={t('form:helperTexts:areaName')}
            defaultValue={areaDefaultName}
            maxLength={100}
          />
        </div>

        <div className={`${styles.formRow} ${styles.formRowEven}`}>
          <DatePicker
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_ALKU_PVM}`}
            label={t(`hankeForm:labels:${FORMFIELD.HAITTA_ALKU_PVM}`)}
            locale={locale}
            maxDate={maxStartDate || undefined}
            initialMonth={maxStartDate || undefined}
            helperText={t('form:helperTexts:dateInForm')}
            onValueChange={handleNuisancesChange}
            required
          />
          <DatePicker
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`}
            label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
            locale={locale}
            minDate={minEndDate || undefined}
            initialMonth={minEndDate || undefined}
            helperText={t('form:helperTexts:dateInForm')}
            onValueChange={handleNuisancesChange}
            required
          />
          <Spacer />
        </div>

        <div className={`${styles.formRow} ${styles.formRowEven}`}>
          <Dropdown
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.MELUHAITTA}`}
            id={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.MELUHAITTA}`}
            options={$enum(HANKE_MELUHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.MELUHAITTA}:${value}`),
            }))}
            defaultValue={formValues[index][FORMFIELD.MELUHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.MELUHAITTA}`)}
            onValueChange={handleNuisancesChange}
            required
          />
          <Dropdown
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.POLYHAITTA}`}
            id={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.POLYHAITTA}`}
            options={$enum(HANKE_POLYHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.POLYHAITTA}:${value}`),
            }))}
            defaultValue={formValues[index][FORMFIELD.POLYHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.POLYHAITTA}`)}
            onValueChange={handleNuisancesChange}
            required
          />
          <Dropdown
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.TARINAHAITTA}`}
            id={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.TARINAHAITTA}`}
            options={$enum(HANKE_TARINAHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.TARINAHAITTA}:${value}`),
            }))}
            defaultValue={formValues[index][FORMFIELD.TARINAHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.TARINAHAITTA}`)}
            onValueChange={handleNuisancesChange}
            required
          />
        </div>

        <div className={`${styles.formRow} ${styles.formRowUnEven}`}>
          <Dropdown
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.KAISTAHAITTA}`}
            id={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.KAISTAHAITTA}`}
            options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAHAITTA}:${value}`),
            }))}
            defaultValue={formValues[index][FORMFIELD.KAISTAHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAHAITTA}`)}
            onValueChange={handleNuisancesChange}
            required
          />
          <Dropdown
            name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.KAISTAPITUUSHAITTA}`}
            id={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.KAISTAPITUUSHAITTA}`}
            options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
              value,
              label: t(`hanke:${FORMFIELD.KAISTAPITUUSHAITTA}:${value}`),
            }))}
            defaultValue={formValues[index][FORMFIELD.KAISTAPITUUSHAITTA] || ''}
            label={t(`hankeForm:labels:${FORMFIELD.KAISTAPITUUSHAITTA}`)}
            onValueChange={handleNuisancesChange}
            required
          />
        </div>
      </Fieldset>
      <ConfirmationDialog
        title={t('hankeForm:labels:removeAreaTitle')}
        description={t('hankeForm:labels:removeAreaDescription', {
          areaName: getValues(`${FORMFIELD.HANKEALUEET}.${index}.nimi`) ?? '',
        })}
        isOpen={areaToRemove !== null}
        close={closeAreaRemoveDialog}
        mainAction={confirmRemoveArea}
        mainBtnLabel={t('common:buttons:remove')}
        mainBtnIcon={<IconTrash />}
        variant="danger"
      />
      <ConfirmationDialog
        title={t('hankeForm:labels:cannotRemoveAreaTitle')}
        description={t('hankeForm:labels:cannotRemoveAreaDescription')}
        isOpen={cannotRemoveArea}
        mainAction={closeCannotRemoveAreaDialog}
        mainBtnLabel={t('common:ariaLabels:closeButtonLabelText')}
        variant="primary"
        showSecondaryButton={false}
      />
    </>
  );
};

export default Haitat;

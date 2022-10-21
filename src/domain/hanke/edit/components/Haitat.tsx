import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Fieldset, IconTrash } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Box, Flex, Spacer } from '@chakra-ui/react';
import { FORMFIELD } from '../types';
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
import { getInputErrorText } from '../../../../common/utils/form';

type Props = {
  index: number;
  onRemoveArea: (index: number) => void;
};

const Haitat: React.FC<Props> = ({ index, onRemoveArea }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    getValues,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const formValues: HankeAlue[] = getValues(FORMFIELD.HANKEALUEET);

  const watchHankeAlueet: HankeAlue[] = watch(FORMFIELD.HANKEALUEET);
  const haittaAlkuPvm = watchHankeAlueet[index]?.haittaAlkuPvm;
  const haittaLoppuPvm = watchHankeAlueet[index]?.haittaLoppuPvm;
  const minEndDate = haittaAlkuPvm && new Date(haittaAlkuPvm);

  useEffect(() => {
    if (haittaAlkuPvm && haittaLoppuPvm && haittaAlkuPvm > haittaLoppuPvm) {
      setValue(`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`, haittaAlkuPvm);
    }
  }, [haittaAlkuPvm, haittaLoppuPvm, index, setValue]);

  const hankeAlueErrors =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors[FORMFIELD.HANKEALUEET] && (errors[FORMFIELD.HANKEALUEET] as any)[index];

  const startDateError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.HAITTA_ALKU_PVM);
  const endDateError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.HAITTA_LOPPU_PVM);
  const meluHaittaError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.MELUHAITTA);
  const polyHaittaError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.POLYHAITTA);
  const tarinaHaittaError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.TARINAHAITTA);
  const kaistaHaittaError = getInputErrorText(t, hankeAlueErrors, FORMFIELD.KAISTAHAITTA);
  const kaistaPituusHaittaError = getInputErrorText(
    t,
    hankeAlueErrors,
    FORMFIELD.KAISTAPITUUSHAITTA
  );

  return (
    <Fieldset
      heading={t('hankeForm:hankkeenAlueForm:haitatHeader')}
      border
      className={styles.haitatContainer}
    >
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenAlueForm:haitatInstructions')}</p>
      </Box>

      <div className={`${styles.formRow} ${styles.formRowEven}`}>
        <DatePicker
          name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_ALKU_PVM}`}
          label={t(`hankeForm:labels:${FORMFIELD.HAITTA_ALKU_PVM}`)}
          locale={locale}
          required
          errorText={startDateError}
        />
        <DatePicker
          name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`}
          label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
          locale={locale}
          required
          errorText={endDateError}
          minDate={minEndDate || undefined}
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
          invalid={Boolean(meluHaittaError)}
          errorMsg={meluHaittaError}
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
          invalid={Boolean(polyHaittaError)}
          errorMsg={polyHaittaError}
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
          invalid={Boolean(tarinaHaittaError)}
          errorMsg={tarinaHaittaError}
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
          invalid={Boolean(kaistaHaittaError)}
          errorMsg={kaistaHaittaError}
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
          invalid={Boolean(kaistaPituusHaittaError)}
          errorMsg={kaistaPituusHaittaError}
          required
        />
      </div>

      <Flex justify="end">
        <Button
          variant="supplementary"
          iconLeft={<IconTrash />}
          onClick={() => onRemoveArea(index)}
        >
          {t('hankeForm:hankkeenAlueForm:removeAreaButton')}
        </Button>
      </Flex>
    </Fieldset>
  );
};

export default Haitat;

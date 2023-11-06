import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Fieldset, IconTrash } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Box, Flex, Spacer } from '@chakra-ui/react';
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
import { getAreaDefaultName } from '../utils';

type Props = {
  index: number;
  onRemoveArea: (index: number) => void;
};

const Haitat: React.FC<Props> = ({ index, onRemoveArea }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { getValues, watch, setValue } = useFormContext<HankeDataFormState>();
  const formValues: HankeAlue[] = getValues(FORMFIELD.HANKEALUEET);

  const watchHankeAlueet: HankeAlue[] = watch(FORMFIELD.HANKEALUEET);
  const haittaAlkuPvm = watchHankeAlueet[index]?.haittaAlkuPvm;
  const haittaLoppuPvm = watchHankeAlueet[index]?.haittaLoppuPvm;
  const minEndDate = haittaAlkuPvm && new Date(haittaAlkuPvm);

  const areaDefaultName = useMemo(
    () => getAreaDefaultName(getValues(FORMFIELD.HANKEALUEET)),
    [getValues],
  );

  useEffect(() => {
    if (haittaAlkuPvm && haittaLoppuPvm && haittaAlkuPvm > haittaLoppuPvm) {
      setValue(`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`, haittaAlkuPvm);
    }
  }, [haittaAlkuPvm, haittaLoppuPvm, index, setValue]);

  return (
    <Fieldset
      heading={t('hankeForm:hankkeenAlueForm:haitatHeader')}
      border
      className={styles.haitatContainer}
    >
      <Box mb="var(--spacing-l)">
        <p>{t('hankeForm:hankkeenAlueForm:haitatInstructions')}</p>
      </Box>

      <div className={`${styles.formRow} ${styles.formRowEven} formWprShort`}>
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
          required
        />
        <DatePicker
          name={`${FORMFIELD.HANKEALUEET}.${index}.${FORMFIELD.HAITTA_LOPPU_PVM}`}
          label={t(`hankeForm:labels:${FORMFIELD.HAITTA_LOPPU_PVM}`)}
          locale={locale}
          required
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

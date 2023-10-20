import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Tooltip, TextArea, SelectionGroup, RadioButton } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';
import { Box } from '@chakra-ui/react';
import TextInput from '../../../common/components/textInput/TextInput';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';
import { useFormPage } from './hooks/useFormPage';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import { getInputErrorText } from '../../../common/utils/form';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Link from '../../../common/components/Link/Link';

const HankeFormPerustiedot: React.FC<React.PropsWithChildren<FormProps>> = ({
  errors,
  register,
  formData,
}) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  useFormPage();

  // Subscribe to vaihe changes in order to update the selected radio button
  const hankeVaiheField = watch(FORMFIELD.VAIHE);
  useEffect(() => {}, [hankeVaiheField, setValue]);

  return (
    <div className="form0">
      <div className="formInstructions">
        <Trans i18nKey="hankeForm:perustiedotForm:instructions">
          <p>Hankkeen luonnin kautta pääset lähettämään myös hakemuksia.</p>
          <p>
            <strong>HUOM!</strong> Mikäli teet pelkkää johtoselvitystä yksityiselle alueelle,
            <Link href={JOHTOSELVITYSHAKEMUS.path}>täytä hakemus</Link>. Yleisten alueiden
            johtoselvitykset haetaan hankkeen luonnin jälkeen kaivuilmoituksen kautta.
          </p>
          <p>Lisäämällä hankkeen tiedot, pystyt kopioimaan ne lopuksi tarvitsemiisi hakemuksiin.</p>
        </Trans>
      </div>
      <Box mb="var(--spacing-l)">
        <p>{t('form:requiredInstruction')}</p>
      </Box>
      <div className="formWpr">
        <TextInput name={FORMFIELD.NIMI} maxLength={100} required />
      </div>
      <div className="formWpr">
        <TextArea
          id={FORMFIELD.KUVAUS}
          label={t(`hankeForm:labels:${FORMFIELD.KUVAUS}`)}
          defaultValue={formData[FORMFIELD.KUVAUS] || ''}
          invalid={!!errors[FORMFIELD.KUVAUS]}
          {...register(FORMFIELD.KUVAUS)}
          data-testid={FORMFIELD.KUVAUS}
          required
          errorText={getInputErrorText(t, errors[FORMFIELD.KUVAUS])}
        />
      </div>
      <div className="formWpr formWprShort">
        <TextInput
          required
          name={FORMFIELD.KATUOSOITE}
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.KATUOSOITE}`),
            tooltipButtonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            tooltipLabel: t(`hankeForm:labels:${FORMFIELD.KATUOSOITE}`),
            placement: 'auto',
          }}
        />
      </div>
      <div className="formWpr">
        <SelectionGroup
          direction="horizontal"
          label={t(`hankeForm:labels:${FORMFIELD.VAIHE}`)}
          required
          errorText={getInputErrorText(t, errors[FORMFIELD.VAIHE])}
        >
          {$enum(HANKE_VAIHE).map((value) => {
            return (
              <RadioButton
                {...register(FORMFIELD.VAIHE)}
                key={value}
                id={value}
                value={value}
                label={t(`hanke:vaihe:${value}`)}
                checked={hankeVaiheField === value}
              />
            );
          })}
        </SelectionGroup>
      </div>
      <div className="formWpr">
        <DropdownMultiselect
          name={FORMFIELD.TYOMAATYYPPI}
          id={FORMFIELD.TYOMAATYYPPI}
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
        <br />
        <h3 className="labelHeader">
          <div>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</div>
          <Tooltip
            buttonLabel={t(`hankeForm:toolTips:tipOpenLabel`)}
            tooltipLabel={t('hankeForm:perustiedotForm:ytkHankeHeader')}
          >
            {t(`hankeForm:toolTips:${FORMFIELD.YKT_HANKE}`)}
          </Tooltip>
        </h3>

        <Checkbox
          id={FORMFIELD.YKT_HANKE}
          name={FORMFIELD.YKT_HANKE}
          label={t(`hankeForm:labels:${FORMFIELD.YKT_HANKE}`)}
          rules={{ required: true }}
        />
      </div>
    </div>
  );
};
export default HankeFormPerustiedot;

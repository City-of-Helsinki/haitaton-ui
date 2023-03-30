import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Tooltip, TextArea, SelectionGroup, RadioButton, Link } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';
import { Box } from '@chakra-ui/react';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import {
  HANKE_VAIHE,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_TYOMAATYYPPI,
  HANKE_TYOMAAKOKO,
} from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';
import { useFormPage } from './hooks/useFormPage';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import { getInputErrorText } from '../../../common/utils/form';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

const HankeFormPerustiedot: React.FC<FormProps> = ({ errors, register, formData }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext();
  const { JOHTOSELVITYSHAKEMUS } = useLocalizedRoutes();
  useFormPage();

  // Subscribe to vaihe changes
  const hankeVaiheField = watch(FORMFIELD.VAIHE);
  // Subscribe to tyomaaKoko changes
  const tyomaaKokoField = watch(FORMFIELD.TYOMAAKOKO);

  useEffect(() => {
    if (hankeVaiheField !== HANKE_VAIHE.SUUNNITTELU) {
      setValue(FORMFIELD.SUUNNITTELUVAIHE, null);
    }
  }, [hankeVaiheField, setValue]);

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
        <TextInput name={FORMFIELD.NIMI} required />
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
        <Dropdown
          id={FORMFIELD.SUUNNITTELUVAIHE}
          name={FORMFIELD.SUUNNITTELUVAIHE}
          options={$enum(HANKE_SUUNNITTELUVAIHE).map((value) => ({
            value,
            label: t(`hanke:suunnitteluVaihe:${value}`),
          }))}
          defaultValue={formData[FORMFIELD.SUUNNITTELUVAIHE] || null}
          label={t(`hankeForm:labels:${FORMFIELD.SUUNNITTELUVAIHE}`)}
          invalid={!!errors[FORMFIELD.SUUNNITTELUVAIHE]}
          required={hankeVaiheField === HANKE_VAIHE.SUUNNITTELU}
          disabled={hankeVaiheField !== HANKE_VAIHE.SUUNNITTELU}
        />
      </div>
      <div className="form3">
        <div className="dataWpr">
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
            <SelectionGroup
              direction="vertical"
              label={t(`hankeForm:labels:${FORMFIELD.TYOMAAKOKO}`)}
            >
              {$enum(HANKE_TYOMAAKOKO).map((value) => {
                return (
                  <RadioButton
                    {...register(FORMFIELD.TYOMAAKOKO)}
                    label={t(`hanke:${FORMFIELD.TYOMAAKOKO}:${value}`)}
                    key={value}
                    id={value}
                    value={value}
                    checked={tyomaaKokoField === value}
                  />
                );
              })}
            </SelectionGroup>
          </div>
        </div>
      </div>
      <div className="formWpr">
        <br />
        <h3 className="labelHeader">
          <div>{t('hankeForm:perustiedotForm:ytkHankeHeader')}</div>
          <Tooltip tooltipLabel={t(`hankeForm:toolTips:tipOpenLabel`)}>
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

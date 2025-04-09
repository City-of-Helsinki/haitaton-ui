import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Tooltip, TextArea, SelectionGroup, RadioButton } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useFormContext } from 'react-hook-form';
import { Box } from '@chakra-ui/react';
import TextInput from '../../../common/components/textInput/TextInput';
import { HANKE_VAIHE, HANKE_TYOMAATYYPPI } from '../../types/hanke';
import { FORMFIELD, FormProps } from './types';
import DropdownMultiselect from '../../../common/components/dropdown/DropdownMultiselect';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import { getInputErrorText } from '../../../common/utils/form';
import Link from '../../../common/components/Link/Link';
import JohtoselvitysCreateDialog from '../../johtoselvitys/johtoselvitysCreateDialog/JohtoselvitysCreateDialog';

const HankeFormPerustiedot: React.FC<React.PropsWithChildren<FormProps>> = ({
  errors,
  register,
  hanke,
}) => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext();
  const [showJohtoselvitysCreateDialog, setShowJohtoselvitysCreateDialog] = useState(false);

  // Subscribe to vaihe changes in order to update the selected radio button
  const hankeVaiheField = watch(FORMFIELD.VAIHE);

  // Allow unselect vaihe, important for draft.
  const handleVaiheClick = (value: HANKE_VAIHE) => {
    const newValue = hankeVaiheField === value ? null : value;
    setValue(FORMFIELD.VAIHE, newValue);
  };

  function openJohtoselvitysCreateDialog() {
    setShowJohtoselvitysCreateDialog(true);
  }

  function closeJohtoselvitysCreateDialog() {
    setShowJohtoselvitysCreateDialog(false);
  }

  return (
    <div className="form0">
      <div className="formInstructions">
        <Trans i18nKey="hankeForm:perustiedotForm:instructions">
          <p>
            Hankkeen luonnin kautta pääset lähettämään myös hakemuksia. Kun hankkeen tarvittavat
            tiedot on täytetty, hanke julkaistaan. Hankkeesta näytetään muille käyttäjille kaikki
            muut tiedot, paitsi yhteystiedot ja liitteet.
          </p>
          <p>
            <strong>HUOM!</strong> Mikäli teet pelkkää johtoselvitystä yksityiselle alueelle,
            <Link href="#" onClick={openJohtoselvitysCreateDialog}>
              täytä hakemus
            </Link>
            . Yleisten alueiden johtoselvitykset haetaan hankkeen luonnin jälkeen kaivuilmoituksen
            kautta.
          </p>
          <p>Lisäämällä hankkeen tiedot, pystyt kopioimaan ne lopuksi tarvitsemiisi hakemuksiin.</p>
          <p>
            Huomioithan, että seuraavat tiedot näytetään julkisesti kaikille Haitattoman käyttäjille
            hankkeen julkaisun jälkeen:
          </p>
          <ul>
            <li>Hankkeen nimi ja tunnus sekä ajankohta</li>
            <li>Hankkeen kuvaus</li>
            <li>Hankealueiden nimet ja ajankohdat</li>
            <li>Hankealueiden liikennehaittaindeksit</li>
            <li>Hankkeen omistajataho</li>
            <li>Hankkeen suunnitteluvaihe ja työn tyyppi</li>
          </ul>
          <p>Tähdellä * merkityt kentät vaaditaan hankkeen julkaisemiseksi.</p>
        </Trans>
      </div>
      <Box marginBottom="var(--spacing-xs)">
        <h2 className="heading-m">{t('hankeSidebar:ariaSidebarContent')}</h2>
      </Box>
      <div className="formWpr">
        <TextInput
          helperText={t('form:helperTexts:isPublicInformation')}
          name={FORMFIELD.NIMI}
          maxLength={100}
          required
        />
      </div>
      <div className="formWpr">
        <TextArea
          id={FORMFIELD.KUVAUS}
          helperText={t('form:helperTexts:isPublicInformation')}
          label={t(`hankeForm:labels:${FORMFIELD.KUVAUS}`)}
          defaultValue={hanke[FORMFIELD.KUVAUS] || ''}
          invalid={!!errors[FORMFIELD.KUVAUS]}
          {...register(FORMFIELD.KUVAUS)}
          data-testid={FORMFIELD.KUVAUS}
          errorText={getInputErrorText(t, errors[FORMFIELD.KUVAUS])}
          required
        />
      </div>
      <div className="formWpr formWprShort">
        <TextInput
          name={FORMFIELD.KATUOSOITE}
          tooltip={{
            tooltipText: t(`hankeForm:toolTips:${FORMFIELD.KATUOSOITE}`),
            tooltipButtonLabel: t(`hankeForm:toolTips:tipOpenLabel`),
            tooltipLabel: t(`hankeForm:labels:${FORMFIELD.KATUOSOITE}`),
            placement: 'auto',
          }}
          required
        />
      </div>
      <div className="formWpr">
        <SelectionGroup
          helperText={t('form:helperTexts:isPublicInformation')}
          label={t(`hankeForm:labels:${FORMFIELD.VAIHE}`)}
          errorText={getInputErrorText(t, errors[FORMFIELD.VAIHE])}
          tooltipLabel={t(`hankeForm:labels:${FORMFIELD.VAIHE}`)}
          tooltipButtonLabel={t(`hankeForm:toolTips:tipOpenLabel`)}
          tooltipText={t(`hankeForm:toolTips:${FORMFIELD.VAIHE}`)}
          required
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
                onClick={() => handleVaiheClick(value)}
              />
            );
          })}
        </SelectionGroup>
      </div>
      <div className="formWpr">
        <DropdownMultiselect
          helperText={t('form:helperTexts:isPublicInformation')}
          name={FORMFIELD.TYOMAATYYPPI}
          id={FORMFIELD.TYOMAATYYPPI}
          options={$enum(HANKE_TYOMAATYYPPI).map((value) => ({
            value,
            label: t(`hanke:${FORMFIELD.TYOMAATYYPPI}:${value}`),
          }))}
          defaultValue={
            hanke
              ? hanke[FORMFIELD.TYOMAATYYPPI]?.map((value) => ({
                  value,
                  label: t(`hanke:${FORMFIELD.TYOMAATYYPPI}:${value}`),
                }))
              : []
          }
          label={t(`hankeForm:labels:${FORMFIELD.TYOMAATYYPPI}`)}
          mapValueToLabel={(value) => t(`hanke:${FORMFIELD.TYOMAATYYPPI}:${value}`)}
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
        />
      </div>

      <JohtoselvitysCreateDialog
        isOpen={showJohtoselvitysCreateDialog}
        onClose={closeJohtoselvitysCreateDialog}
      />
    </div>
  );
};
export default HankeFormPerustiedot;

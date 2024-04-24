import { Box } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Checkbox as HDSCheckbox, SelectionGroup } from 'hds-react';
import TextInput from '../../common/components/textInput/TextInput';
import TextArea from '../../common/components/textArea/TextArea';
import styles from './BasicInfo.module.scss';
import { KaivuilmoitusFormValues } from './types';
import Checkbox from '../../common/components/checkbox/Checkbox';
import TagInput from '../../common/components/tagInput/TagInput';
import InputCombobox from '../../common/components/inputCombobox/InputCombobox';

type Props = {
  johtoselvitysIds?: string[];
};

export default function BasicInfo({ johtoselvitysIds }: Readonly<Props>) {
  const { t } = useTranslation();
  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<KaivuilmoitusFormValues>();

  const [
    constructionWorkChecked,
    maintenanceWorkChecked,
    emergencyWorkChecked,
    placementContracts,
  ] = watch([
    'applicationData.constructionWork',
    'applicationData.maintenanceWork',
    'applicationData.emergencyWork',
    'applicationData.placementContracts',
  ]);

  // Trigger validation for constructionWork field
  function validateConstructionWork() {
    trigger('applicationData.constructionWork');
  }

  function getTagDeleteButtonAriaLabel(tag: string) {
    return t('hakemus:buttons:deletePlacementContract', { id: tag });
  }

  function handlePlacementContractsChange(updatedContracts: string[]) {
    setValue('applicationData.placementContracts', updatedContracts);
  }

  return (
    <div>
      <div className={styles.formInstructions}>
        <Trans i18nKey="kaivuilmoitusForm:perustiedot:instructions">
          <p>
            Helsingin kaupungin kaduilla, jalankulku- tai pyöräteillä, toreilla tai puistoissa
            tehtävistä kaivu-, kairaus- ja louhintatöistä on tehtävä kaivuilmoitus. Kaivuilmoituksen
            jättämisen yhteydessä pyydetään viranomaiselta automaattisesti myös johtoselvitys,
            mikäli aiemmin tehdyn johtoselvityksen tunnusta ei ole liitetty hakemukseen.
          </p>
          <p>
            Hakemukseen liittyy olennaisena osana käyttäjän täyttämä haittojenhallintasuunnitelma,
            jonka toteutumista viranomainen seuraa työn aikana. Ilmoituksen liitteeksi laaditaan
            tilapäisen liikennejärjestelyn suunnitelma, mikäli työ vaikuttaa jalankulkuun
            pyöräliikenteeseen tai moottoriajoneuvoliikenteeseen tai pysäköintipaikkoja varataan
            muuhun käyttöön siirtokehotuskyltillä.
          </p>
          <p>
            Kaivutyö tulee ilmoittaa talvikaudella (1.12.–14.5.) toiminnalliseen kuntoon ja kaikissa
            tapauksissa valmiiksi, jotta työ voidaan valvoa ja laskutus katkaista tai päättää.
          </p>
          <p>
            Kaikki tähdellä * merkityt kentät ovat hakemuksen lähettämisen kannalta pakollisia. Työn
            nimi vaaditaan lomakkeen tallentamiseen.
          </p>
        </Trans>
      </div>

      <Box as="h2" className="heading-m" marginBottom="var(--spacing-s)">
        {t('form:headers:hakemusInfo')}
      </Box>

      <TextInput
        className={styles.formRow}
        name="applicationData.name"
        label={t('hakemus:labels:nimi')}
        required
        autoComplete="on"
      />

      <TextArea
        className={styles.formRow}
        name="applicationData.workDescription"
        label={t('hakemus:labels:kuvaus')}
        required
      />

      <SelectionGroup
        className={styles.formRow}
        label={t('hakemus:labels:tyossaKyse')}
        required
        errorText={errors?.applicationData?.constructionWork && t('form:validations:required')}
      >
        <HDSCheckbox
          {...register('applicationData.constructionWork', {
            // Trigger validation for applicationData.constructionWork when
            // running onChange handlers for each of these checkboxes
            // to keep work is about validation error up to date
            onChange: validateConstructionWork,
          })}
          id="applicationData.constructionWork"
          name="applicationData.constructionWork"
          label={t('hakemus:labels:constructionWork')}
          checked={constructionWorkChecked}
        />
        <HDSCheckbox
          {...register('applicationData.maintenanceWork', {
            onChange: validateConstructionWork,
          })}
          id="applicationData.maintenanceWork"
          name="applicationData.maintenanceWork"
          label={t('hakemus:labels:maintenanceWork')}
          checked={maintenanceWorkChecked}
        />
        <HDSCheckbox
          {...register('applicationData.emergencyWork', {
            onChange: validateConstructionWork,
          })}
          id="applicationData.emergencyWork"
          name="applicationData.emergencyWork"
          label={t('hakemus:labels:emergencyWork')}
          checked={emergencyWorkChecked}
        />
      </SelectionGroup>

      {johtoselvitysIds !== undefined && (
        <InputCombobox
          id="applicationData.cableReports"
          name="applicationData.cableReports"
          options={johtoselvitysIds}
          label={t('hakemus:labels:cableReports')}
          helperText={t('hakemus:labels:cableReportsHelp')}
          className={styles.formRow}
          pattern={/^JS\d{7}$/}
          errorText={t('hakemus:errors:cableReport')}
        />
      )}

      <Box as="h3" className="heading-s" marginBottom="var(--spacing-s)">
        {t('hakemus:labels:placementContractsTitle')}
      </Box>
      <TagInput
        className={styles.formRow}
        id="placementContract"
        label={t('hakemus:labels:placementContracts')}
        tags={placementContracts ?? []}
        tagDeleteButtonAriaLabel={getTagDeleteButtonAriaLabel}
        pattern="^SL\d{7}$"
        placeholder="SLXXXXXXX"
        helperText={t('hakemus:labels:placementContractsHelp')}
        errorText={t('hakemus:errors:placementContract')}
        onChange={handlePlacementContractsChange}
      />

      <Box as="h3" className="heading-s" marginBottom="var(--spacing-s)">
        {t('hakemus:labels:requiredCompetenceTitle')}
      </Box>
      <Checkbox
        className={styles.formRow}
        id="applicationData.requiredCompetence"
        name="applicationData.requiredCompetence"
        label={t('hakemus:labels:requiredCompetence')}
      />
    </div>
  );
}

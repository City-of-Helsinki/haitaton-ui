import { Checkbox, Link, SelectionGroup } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import styles from './BasicInfo.module.scss';
import TextInput from '../../common/components/textInput/TextInput';
import TextArea from '../../common/components/textArea/TextArea';
import Text from '../../common/components/text/Text';
import { JohtoselvitysFormValues } from './types';
import { getInputErrorText } from '../../common/utils/form';
import BooleanRadioButton from '../../common/components/radiobutton/BooleanRadioButton';

export function BasicInfo() {
  const {
    register,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext<JohtoselvitysFormValues>();
  const { t } = useTranslation();

  const [
    constructionWorkChecked,
    maintenanceWorkChecked,
    propertyConnectivityChecked,
    emergencyWorkChecked,
  ] = watch([
    'applicationData.constructionWork',
    'applicationData.maintenanceWork',
    'applicationData.propertyConnectivity',
    'applicationData.emergencyWork',
  ]);

  // Trigger validation for constructionWork field
  function validateConstructionWork() {
    trigger('applicationData.constructionWork');
  }

  return (
    <div>
      <div className={styles.formInstructions}>
        <Trans
          i18nKey="johtoselvitysForm:perustiedot:instructions"
          components={{
            a: (
              <Link
                href="https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/tontit-ja-rakentamisen-luvat/rakentamisvaiheen-ohjeet/kaduilla-ja-puistoissa-tehtavat-tyot"
                openInNewTab
              >
                hel.fi
              </Link>
            ),
          }}
        />
      </div>

      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:headers:hakemusInfo')}
      </Text>

      <TextInput
        className={styles.formRow}
        name="applicationData.name"
        label={t('hakemus:labels:nimi')}
        required
        autoComplete="on"
        maxLength={100}
      />

      <TextInput
        className={styles.formRow}
        name="applicationData.postalAddress.streetAddress.streetName"
        label={t('form:yhteystiedot:labels:osoite')}
        required
        autoComplete="street-address"
      />

      <SelectionGroup
        label={t('hakemus:labels:tyossaKyse')}
        required
        className={styles.formRow}
        errorText={errors?.applicationData?.constructionWork && t('form:validations:required')}
      >
        <Checkbox
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
        <Checkbox
          {...register('applicationData.maintenanceWork', {
            onChange: validateConstructionWork,
          })}
          id="applicationData.maintenanceWork"
          name="applicationData.maintenanceWork"
          label={t('hakemus:labels:maintenanceWork')}
          checked={maintenanceWorkChecked}
        />
        <Checkbox
          {...register('applicationData.propertyConnectivity', {
            onChange: validateConstructionWork,
          })}
          id="applicationData.propertyConnectivity"
          name="applicationData.propertyConnectivity"
          label={t('hakemus:labels:propertyConnectivity')}
          checked={propertyConnectivityChecked}
        />
        <Checkbox
          {...register('applicationData.emergencyWork', {
            onChange: validateConstructionWork,
          })}
          id="applicationData.emergencyWork"
          name="applicationData.emergencyWork"
          label={t('hakemus:labels:emergencyWork')}
          checked={emergencyWorkChecked}
        />
      </SelectionGroup>

      <SelectionGroup
        label={t('hakemus:labels:rockExcavation')}
        direction="horizontal"
        required
        className={styles.formRow}
        errorText={getInputErrorText(t, errors?.applicationData?.rockExcavation)}
      >
        <BooleanRadioButton<JohtoselvitysFormValues>
          name="applicationData.rockExcavation"
          label={t('common:yes')}
          id="excavationYes"
          value={true}
        />
        <BooleanRadioButton<JohtoselvitysFormValues>
          name="applicationData.rockExcavation"
          label={t('common:no')}
          id="excavationNo"
          value={false}
        />
      </SelectionGroup>

      <TextArea
        className={styles.formRow}
        name="applicationData.workDescription"
        label={t('hakemus:labels:kuvaus')}
        required
        maxLength={2000}
      />
    </div>
  );
}

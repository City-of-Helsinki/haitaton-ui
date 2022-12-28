import React from 'react';
import { Checkbox, SelectionGroup } from 'hds-react';
import * as Yup from 'yup';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { ApplicationType } from './types';
import styles from './BasicInfo.module.scss';
import TextInput from '../../common/components/textInput/TextInput';
import TextArea from '../../common/components/textArea/TextArea';
import Text from '../../common/components/text/Text';

export const validationSchema = {
  name: Yup.string().required(),
  workDescription: Yup.string().required(),
};

export interface InitialValueTypes {
  applicationType: ApplicationType;
  applicationData: {
    applicationType: ApplicationType;
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
    applicationType: 'CABLE_REPORT',
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

// type Option = { value: string; label: string };

export const BasicHankeInfo: React.FC = () => {
  const { register, watch } = useFormContext();
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

  return (
    <div>
      <div className={styles.formInstructions}>
        <Trans i18nKey="johtoselvitysForm:perustiedot:instructions">
          <p>
            Huomioithan, että johtoselvitys on voimassa 1 kuukauden. Johtoselvityksen tulee olla
            voimassa johtojen maastonäyttöjä tilattaessa sekä Johtoselvitysta tehdessä.
            Johtoselvitys on tarvittaessa päivitettävä.
          </p>
          <p>
            Yleisellä alueella tehtävästä työstä on tehtävä erillinen ilmoitus kaupungille. Mikäli
            joudut rajoittamaan liikennettä esimerkiksi työkoneiden kuljetuksen vuoksi tai
            poistamaan pysäköintipaikkoja kadun varresta, tulee sinun tehdä myös aluevuokraushakemus
            liikennejärjestelysuunnitelmineen.
          </p>
        </Trans>
      </div>

      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:headers:hakemusInfo')}
      </Text>

      <TextInput
        className={styles.formField}
        name="applicationData.name"
        label={t('hakemus:labels:nimi')}
        required
      />

      <div className={styles.formField}>
        <SelectionGroup label={t('hakemus:labels:tyossaKyse')} required>
          <Checkbox
            {...register('applicationData.constructionWork')}
            id="applicationData.constructionWork"
            name="applicationData.constructionWork"
            label={t('hakemus:labels:constructionWork')}
            checked={constructionWorkChecked}
          />
          <Checkbox
            {...register('applicationData.maintenanceWork')}
            id="applicationData.maintenanceWork"
            name="applicationData.maintenanceWork"
            label={t('hakemus:labels:maintenanceWork')}
            checked={maintenanceWorkChecked}
          />
          <Checkbox
            {...register('applicationData.propertyConnectivity')}
            id="applicationData.propertyConnectivity"
            name="applicationData.propertyConnectivity"
            label={t('hakemus:labels:propertyConnectivity')}
            checked={propertyConnectivityChecked}
          />
          <Checkbox
            {...register('applicationData.emergencyWork')}
            id="applicationData.emergencyWork"
            name="applicationData.emergencyWork"
            label={t('hakemus:labels:emergencyWork')}
            checked={emergencyWorkChecked}
          />
        </SelectionGroup>
      </div>

      <TextArea
        className={styles.formField}
        name="applicationData.workDescription"
        label={t('hakemus:labels:kuvaus')}
        required
      />
    </div>
  );
};

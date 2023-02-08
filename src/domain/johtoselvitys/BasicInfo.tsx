import React, { useEffect, useState } from 'react';
import { Checkbox, Select, SelectionGroup } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { ApplicationType, CustomerType } from '../application/types/application';
import styles from './BasicInfo.module.scss';
import TextInput from '../../common/components/textInput/TextInput';
import TextArea from '../../common/components/textArea/TextArea';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import useUser from '../auth/useUser';
import { findOrdererKey } from './utils';

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

type Option = { value: CustomerType; label: string };

export const BasicHankeInfo: React.FC = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  const { t } = useTranslation();
  const user = useUser();

  const [selectedRole, setSelectedRole] = useState(() =>
    // Set contact key with orderer field true to be the initial selected role.
    findOrdererKey(getValues('applicationData'))
  );

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

  useEffect(() => {
    if (user.data?.profile.name && !getValues(`applicationData.${selectedRole}.contacts.0.name`)) {
      setValue(`applicationData.${selectedRole}.contacts.0.name`, user.data?.profile.name);
    }
  }, [user.data?.profile.name, setValue, selectedRole, getValues]);

  useEffect(() => {
    if (
      user.data?.profile.email &&
      !getValues(`applicationData.${selectedRole}.contacts.0.email`)
    ) {
      setValue(`applicationData.${selectedRole}.contacts.0.email`, user.data?.profile.email);
    }
  }, [user.data?.profile.email, setValue, selectedRole, getValues]);

  const roleOptions: Option[] = [
    { value: 'customerWithContacts', label: t('form:yhteystiedot:titles:customerWithContacts') },
    {
      value: 'contractorWithContacts',
      label: t('form:yhteystiedot:titles:contractorWithContacts'),
    },
    { value: 'propertyDeveloperWithContacts', label: t('form:yhteystiedot:titles:rakennuttajat') },
    {
      value: 'representativeWithContacts',
      label: t('form:yhteystiedot:titles:representativeWithContacts'),
    },
  ];

  function handleRoleChange(role: Option) {
    const emptyContact = {
      email: '',
      name: '',
      orderer: false,
      phone: '',
      postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
    };

    const previousRoleContacts = getValues(`applicationData.${selectedRole}.contacts`);

    // Remove moved contact from previous selected role contacts
    setValue(
      `applicationData.${selectedRole}.contacts`,
      previousRoleContacts.length > 1 ? previousRoleContacts.slice(1) : []
    );

    let selectedRoleContacts = getValues(`applicationData.${role.value}.contacts`);

    const contactToMove = previousRoleContacts.slice(0, 1);

    selectedRoleContacts =
      selectedRoleContacts === null ||
      (selectedRoleContacts.length === 1 && isEqual(selectedRoleContacts[0], emptyContact))
        ? contactToMove
        : contactToMove.concat(selectedRoleContacts);

    setValue(`applicationData.${role.value}.contacts`, selectedRoleContacts);

    setSelectedRole(role.value);
  }

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
        className={styles.formRow}
        name="applicationData.name"
        label={t('hakemus:labels:nimi')}
        required
      />

      <ResponsiveGrid className={styles.formRow}>
        <TextInput
          name="applicationData.postalAddress.streetAddress.streetName"
          label={t('form:yhteystiedot:labels:osoite')}
          required
        />
        <TextInput
          name="applicationData.postalAddress.postalCode"
          label={t('form:yhteystiedot:labels:postinumero')}
          required
        />
        <TextInput
          name="applicationData.postalAddress.city"
          label={t('form:yhteystiedot:labels:postitoimipaikka')}
          required
        />
      </ResponsiveGrid>

      <SelectionGroup label={t('hakemus:labels:tyossaKyse')} required className={styles.formRow}>
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

      <TextArea
        className={styles.formRow}
        name="applicationData.workDescription"
        label={t('hakemus:labels:kuvaus')}
        required
      />

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:labels:omatTiedot')}
      </Text>

      <ResponsiveGrid className={styles.formRow}>
        <Select<Option>
          options={roleOptions}
          id="roleInApplication"
          defaultValue={roleOptions.find((role) => role.value === selectedRole)}
          label={t('form:labels:role')}
          onChange={handleRoleChange}
          helper={t('form:labels:roleHelper')}
          required
        />
      </ResponsiveGrid>

      {/* TODO: Getting the profile information will be done in HAI-1398 */}
      {/* Until then, user can input name */}
      {/* <Text tag="p" styleAs="body-m" spacingBottom="xs">
        <Box as="span" fontWeight={500}>
          {t('form:yhteystiedot:labels:nimi')} *
        </Box>
      </Text>
      <Text tag="p" styleAs="body-l" spacingBottom="xs">
        {getValues(`applicationData.${selectedRole}.contacts.0.name`)}
      </Text> */}
      {/* <Text tag="p" styleAs="body-m" spacingBottom="s">
        <Box as="span" color="var(--color-black-60)">
          {t('form:labels:fromHelsinkiProfile')}
        </Box>
      </Text> */}
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.name`}
          label={t('form:yhteystiedot:labels:nimi')}
          required
        />
      </ResponsiveGrid>

      <ResponsiveGrid className={styles.formRow}>
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.postalAddress.streetAddress.streetName`}
          label={t('form:yhteystiedot:labels:osoite')}
        />
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.postalAddress.postalCode`}
          label={t('form:yhteystiedot:labels:postinumero')}
        />
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.postalAddress.city`}
          label={t('form:yhteystiedot:labels:postitoimipaikka')}
        />
      </ResponsiveGrid>
      <ResponsiveGrid className={styles.formRow}>
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
        />
        <TextInput
          name={`applicationData.${selectedRole}.contacts.0.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
        />
      </ResponsiveGrid>
    </div>
  );
};

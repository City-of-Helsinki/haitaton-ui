import React, { useEffect, useState } from 'react';
import { Checkbox, Link, Notification, Select, SelectionGroup } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { ApplicationType, Contact, Customer, CustomerType } from '../application/types/application';
import styles from './BasicInfo.module.scss';
import TextInput from '../../common/components/textInput/TextInput';
import TextArea from '../../common/components/textArea/TextArea';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import useUser from '../auth/useUser';
import { findOrdererKey } from './utils';
import { JohtoselvitysFormValues } from './types';
import { getInputErrorText } from '../../common/utils/form';
import BooleanRadioButton from '../../common/components/radiobutton/BooleanRadioButton';

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

const emptyCustomer: Customer = {
  type: null,
  name: '',
  country: 'FI',
  email: '',
  phone: '',
  registryKey: null,
  ovt: null,
  invoicingOperator: null,
  sapCustomerNumber: null,
};

const emptyContact: Contact = {
  email: '',
  firstName: '',
  lastName: '',
  orderer: false,
  phone: '',
};

const customerTypes: CustomerType[] = [
  'customerWithContacts',
  'contractorWithContacts',
  'propertyDeveloperWithContacts',
  'representativeWithContacts',
];

type Option = { value: CustomerType; label: string };

export const BasicHankeInfo: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<JohtoselvitysFormValues>();
  const { t } = useTranslation();
  const user = useUser();

  const applicationSent: boolean = getValues('alluStatus') !== null;

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
    const userFirstName = user.data?.profile.given_name;
    const userLastName = user.data?.profile.family_name;
    if (userFirstName && !getValues(`applicationData.${selectedRole}.contacts.0.firstName`)) {
      setValue(`applicationData.${selectedRole}.contacts.0.firstName`, userFirstName);
    }
    if (userLastName && !getValues(`applicationData.${selectedRole}.contacts.0.lastName`)) {
      setValue(`applicationData.${selectedRole}.contacts.0.lastName`, userLastName);
    }
  }, [
    user.data?.profile.given_name,
    user.data?.profile.family_name,
    setValue,
    selectedRole,
    getValues,
  ]);

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
    if (role.value === selectedRole) return;

    const previousRoleContacts = getValues(`applicationData.${selectedRole}.contacts`);
    const contactToMove = previousRoleContacts.slice(0, 1);

    let selectedRoleContacts = getValues(`applicationData.${role.value}.contacts`);

    selectedRoleContacts =
      selectedRoleContacts === null ||
      (selectedRoleContacts.length === 1 && isEqual(selectedRoleContacts[0], emptyContact))
        ? contactToMove
        : contactToMove.concat(selectedRoleContacts);

    // Remove moved contact from previous selected role contacts
    setValue(
      `applicationData.${selectedRole}.contacts`,
      previousRoleContacts.length > 1 ? previousRoleContacts.slice(1) : [emptyContact],
      {
        shouldValidate: true,
      }
    );

    if (!getValues(`applicationData.${role.value}.customer`)) {
      setValue(`applicationData.${role.value}.customer`, emptyCustomer);
    }

    setValue(`applicationData.${role.value}.contacts`, selectedRoleContacts, {
      shouldDirty: true,
    });

    setSelectedRole(role.value);
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
      />

      <TextInput
        className={styles.formRow}
        name="applicationData.postalAddress.streetAddress.streetName"
        label={t('form:yhteystiedot:labels:osoite')}
        required
      />

      <SelectionGroup
        label={t('hakemus:labels:tyossaKyse')}
        required
        className={styles.formRow}
        errorText={errors?.applicationData?.constructionWork && t('form:validations:required')}
      >
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
          // eslint-disable-next-line react/jsx-boolean-value
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
      />

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:labels:omatTiedot')}
      </Text>

      {applicationSent && (
        <Notification
          label={t('hakemus:notifications:sentApplicationPersonalInfoNotification')}
          size="small"
          style={{ marginBottom: 'var(--spacing-s)' }}
        >
          {t('hakemus:notifications:sentApplicationPersonalInfoNotification')}
        </Notification>
      )}

      <ResponsiveGrid>
        <Select<Option>
          options={roleOptions}
          id="roleInApplication"
          defaultValue={roleOptions.find((role) => role.value === selectedRole)}
          label={t('form:labels:role')}
          onChange={handleRoleChange}
          helper={t('form:labels:roleHelper')}
          required
          disabled={applicationSent}
        />
      </ResponsiveGrid>

      {customerTypes.map((customerType) => {
        if (customerType === selectedRole) {
          return (
            <React.Fragment key={customerType}>
              <ResponsiveGrid>
                <TextInput
                  name={`applicationData.${selectedRole}.contacts.0.firstName`}
                  label={t('hankeForm:labels:etunimi')}
                  required
                  readOnly={Boolean(user.data?.profile.given_name)}
                  helperText={
                    user.data?.profile.given_name ? t('form:labels:fromHelsinkiProfile') : ''
                  }
                  disabled={applicationSent}
                />
                <TextInput
                  name={`applicationData.${selectedRole}.contacts.0.lastName`}
                  label={t('hankeForm:labels:sukunimi')}
                  required
                  readOnly={Boolean(user.data?.profile.family_name)}
                  helperText={
                    user.data?.profile.family_name ? t('form:labels:fromHelsinkiProfile') : ''
                  }
                  disabled={applicationSent}
                />
              </ResponsiveGrid>

              <ResponsiveGrid className={styles.formRow}>
                <TextInput
                  name={`applicationData.${customerType}.contacts.0.email`}
                  label={t('form:yhteystiedot:labels:email')}
                  required
                  disabled={applicationSent}
                />
                <TextInput
                  name={`applicationData.${customerType}.contacts.0.phone`}
                  label={t('form:yhteystiedot:labels:puhelinnumero')}
                  required
                  disabled={applicationSent}
                />
              </ResponsiveGrid>
            </React.Fragment>
          );
        }
        return null;
      })}
    </div>
  );
};

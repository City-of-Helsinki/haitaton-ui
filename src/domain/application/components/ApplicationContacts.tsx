import React, { useEffect } from 'react';
import { Accordion, Button, Fieldset, IconPlusCircle } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import {
  Application,
  ApplicationType,
  Contact,
  ContactType,
  CustomerType,
  CustomerWithContacts,
} from '../types/application';
import Text from '../../../common/components/text/Text';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import TextInput from '../../../common/components/textInput/TextInput';
import useLocale from '../../../common/hooks/useLocale';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import FormContact from '../../forms/components/FormContact';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';
import { useHankeUsers } from '../../hanke/hankeUsers/hooks/useHankeUsers';
import { mapHankeUserToContact } from '../../hanke/hankeUsers/utils';
import UserSearchInput from '../../hanke/hankeUsers/UserSearchInput';
import { TFunction } from 'i18next';

function getEmptyCustomerWithContacts(): CustomerWithContacts {
  return {
    customer: {
      yhteystietoId: null,
      type: ContactType.COMPANY,
      name: '',
      email: '',
      phone: '',
      registryKey: null,
      registryKeyHidden: false,
    },
    contacts: [],
  };
}

function isRegistryKeyInputEnabled(
  customerType: CustomerType,
  selectedContactType: keyof typeof ContactType | null,
  applicationType: ApplicationType,
) {
  return (
    selectedContactType === 'COMPANY' ||
    selectedContactType === 'ASSOCIATION' ||
    (applicationType === 'EXCAVATION_NOTIFICATION' && customerType === 'customerWithContacts')
  );
}

function getRegistryKeyLabel(
  t: TFunction<'translation', undefined>,
  customerType: CustomerType,
  selectedContactType: keyof typeof ContactType | null,
  applicationType: ApplicationType,
) {
  if (applicationType === 'EXCAVATION_NOTIFICATION' && customerType === 'customerWithContacts') {
    if (selectedContactType === 'PERSON') {
      return t('form:yhteystiedot:labels:henkilotunnus');
    } else if (selectedContactType === 'OTHER') {
      return t('form:yhteystiedot:labels:muuTunnus');
    }
  }
  return t('form:yhteystiedot:labels:ytunnus');
}

const CustomerFields: React.FC<{
  customerType: CustomerType;
  hankeUsers?: HankeUser[];
}> = ({ customerType, hankeUsers }) => {
  const { t } = useTranslation();
  const { watch, setValue, getValues } = useFormContext<Application>();

  const applicationType = getValues('applicationData.applicationType');
  const selectedContactType = watch(`applicationData.${customerType}.customer.type`);
  const registryKeyInputEnabled = isRegistryKeyInputEnabled(
    customerType,
    selectedContactType,
    applicationType,
  );

  useEffect(() => {
    // If setting contact type disables the registry key, set it to null
    if (!isRegistryKeyInputEnabled(customerType, selectedContactType, applicationType)) {
      setValue(`applicationData.${customerType}.customer.registryKey`, null, {
        shouldValidate: true,
      });
    }
    // always set registry key hidden to false when changing the contact type
    setValue(`applicationData.${customerType}.customer.registryKeyHidden`, false, {
      shouldValidate: true,
    });
  }, [selectedContactType, customerType, applicationType, setValue]);

  function handleUserSelect(user: HankeUser) {
    setValue(`applicationData.${customerType}.customer.email`, user.sahkoposti, {
      shouldValidate: true,
    });
    setValue(`applicationData.${customerType}.customer.phone`, user.puhelinnumero, {
      shouldValidate: true,
    });
  }

  return (
    <Fieldset
      heading={t(`form:yhteystiedot:titles:${customerType}`)}
      style={{
        paddingTop: 'var(--spacing-s)',
        maxWidth: 'var(--width-form-2-col)',
        minInlineSize: 'auto',
      }}
    >
      <TextInput
        name={`applicationData.${customerType}.customer.yhteystietoId`}
        style={{ display: 'none' }}
      />
      <ResponsiveGrid maxColumns={2}>
        <Dropdown
          id={`applicationData.${customerType}.customer.type`}
          name={`applicationData.${customerType}.customer.type`}
          required
          defaultValue={ContactType.COMPANY}
          label={t('form:yhteystiedot:labels:tyyppi')}
          options={$enum(ContactType).map((value) => {
            return {
              value,
              label: t(`form:yhteystiedot:contactType:${value}`),
            };
          })}
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <UserSearchInput
          fieldName={`applicationData.${customerType}.customer.name`}
          id={customerType}
          required
          hankeUsers={hankeUsers}
          onUserSelect={handleUserSelect}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.registryKey`}
          label={getRegistryKeyLabel(t, customerType, selectedContactType, applicationType)}
          disabled={!registryKeyInputEnabled}
          autoComplete="on"
          defaultValue={null}
          required={applicationType === 'EXCAVATION_NOTIFICATION' && registryKeyInputEnabled}
        />
      </ResponsiveGrid>
      <ResponsiveGrid maxColumns={2}>
        <TextInput
          name={`applicationData.${customerType}.customer.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
          autoComplete="email"
        />
        <TextInput
          name={`applicationData.${customerType}.customer.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
          autoComplete="tel"
        />
      </ResponsiveGrid>
    </Fieldset>
  );
};

export default function ApplicationContacts() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { watch, setValue, getValues } = useFormContext<Application>();
  const hankeTunnus = getValues('hankeTunnus');
  const { data: hankeUsers } = useHankeUsers(hankeTunnus);
  const queryClient = useQueryClient();

  const [propertyDeveloper, representative] = watch([
    'applicationData.propertyDeveloperWithContacts',
    'applicationData.representativeWithContacts',
  ]);

  const isPropertyDeveloper = Boolean(propertyDeveloper);
  const isRepresentative = Boolean(representative);

  function addCustomerWithContacts(customerType: CustomerType) {
    setValue(`applicationData.${customerType}`, getEmptyCustomerWithContacts());
  }

  function removeCustomerWithContacts(customerType: CustomerType) {
    setValue(`applicationData.${customerType}`, null);
  }

  const handleRemovePropertyDeveloper = !propertyDeveloper?.contacts[0]?.orderer
    ? () => removeCustomerWithContacts('propertyDeveloperWithContacts')
    : undefined;

  const handleRemoveRepresentative = !representative?.contacts[0]?.orderer
    ? () => removeCustomerWithContacts('representativeWithContacts')
    : undefined;

  function addYhteyshenkiloForYhteystieto(customerType: CustomerType, contactPerson: HankeUser) {
    const previousContacts = getValues(`applicationData.${customerType}.contacts`) || [];
    setValue(
      `applicationData.${customerType}.contacts`,
      previousContacts.concat(mapHankeUserToContact(contactPerson)),
      { shouldDirty: true, shouldValidate: true },
    );
    void queryClient.invalidateQueries(['hankeUsers', hankeTunnus]);
  }

  function mapContactToLabel(contact: Contact) {
    return `${contact.firstName} ${contact.lastName} (${contact.email})`;
  }

  function removeOrdererFromContact(contact: Contact): Contact {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderer, ...rest } = contact;
    return rest;
  }

  return (
    <div>
      <Text tag="p" spacingBottom="s">
        {t('johtoselvitysForm:yhteystiedot:instructions')}
      </Text>
      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h3" styleAs="h3" weight="light" spacingBottom="s">
        {t('form:yhteystiedot:titles:customerWithContactsInfo')}
      </Text>

      {/* Työstä vastaava */}
      <FormContact<CustomerType, Contact>
        name={`applicationData.customerWithContacts.contacts`}
        contactType="customerWithContacts"
        hankeTunnus={hankeTunnus!}
        hankeUsers={hankeUsers}
        mapHankeUserToValue={mapHankeUserToContact}
        mapValueToLabel={mapContactToLabel}
        transformValue={(value) => removeOrdererFromContact(value)}
        onContactPersonAdded={(user) =>
          addYhteyshenkiloForYhteystieto('customerWithContacts', user)
        }
        required
        tooltip={{
          tooltipButtonLabel: t('hankeForm:toolTips:tipOpenLabel'),
          tooltipLabel: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
          tooltipText: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
        }}
      >
        <CustomerFields customerType="customerWithContacts" hankeUsers={hankeUsers} />
      </FormContact>

      {/* Työn suorittaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:contractorInfo')}
        headingLevel={3}
        initiallyOpen
      >
        <FormContact<CustomerType, Contact>
          name={`applicationData.contractorWithContacts.contacts`}
          contactType="contractorWithContacts"
          hankeTunnus={hankeTunnus!}
          hankeUsers={hankeUsers}
          mapHankeUserToValue={mapHankeUserToContact}
          mapValueToLabel={mapContactToLabel}
          transformValue={(value) => removeOrdererFromContact(value)}
          onContactPersonAdded={(user) =>
            addYhteyshenkiloForYhteystieto('contractorWithContacts', user)
          }
          required
          tooltip={{
            tooltipButtonLabel: t('hankeForm:toolTips:tipOpenLabel'),
            tooltipLabel: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
            tooltipText: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
          }}
        >
          <CustomerFields customerType="contractorWithContacts" hankeUsers={hankeUsers} />
        </FormContact>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:propertyDeveloperInfo')}
        headingLevel={3}
        initiallyOpen={isPropertyDeveloper}
      >
        {isPropertyDeveloper && (
          <FormContact<CustomerType, Contact>
            name={`applicationData.propertyDeveloperWithContacts.contacts`}
            contactType="propertyDeveloperWithContacts"
            hankeTunnus={hankeTunnus!}
            hankeUsers={hankeUsers}
            mapHankeUserToValue={mapHankeUserToContact}
            mapValueToLabel={mapContactToLabel}
            transformValue={(value) => removeOrdererFromContact(value)}
            onRemove={handleRemovePropertyDeveloper}
            onContactPersonAdded={(user) =>
              addYhteyshenkiloForYhteystieto('propertyDeveloperWithContacts', user)
            }
            required
            tooltip={{
              tooltipButtonLabel: t('hankeForm:toolTips:tipOpenLabel'),
              tooltipLabel: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
              tooltipText: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
            }}
          >
            <CustomerFields customerType="propertyDeveloperWithContacts" hankeUsers={hankeUsers} />
          </FormContact>
        )}

        {!isPropertyDeveloper && (
          <Button
            variant="supplementary"
            iconLeft={<IconPlusCircle aria-hidden="true" />}
            onClick={() => addCustomerWithContacts('propertyDeveloperWithContacts')}
          >
            {t('form:yhteystiedot:titles:lisaaRakennuttaja')}
          </Button>
        )}
      </Accordion>

      {/* Asianhoitaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:representativeInfo')}
        headingLevel={3}
        initiallyOpen={isRepresentative}
      >
        {isRepresentative && (
          <FormContact<CustomerType, Contact>
            name={`applicationData.representativeWithContacts.contacts`}
            contactType="representativeWithContacts"
            hankeTunnus={hankeTunnus!}
            hankeUsers={hankeUsers}
            mapHankeUserToValue={mapHankeUserToContact}
            mapValueToLabel={mapContactToLabel}
            transformValue={(value) => removeOrdererFromContact(value)}
            onRemove={handleRemoveRepresentative}
            onContactPersonAdded={(user) =>
              addYhteyshenkiloForYhteystieto('representativeWithContacts', user)
            }
            required
            tooltip={{
              tooltipButtonLabel: t('hankeForm:toolTips:tipOpenLabel'),
              tooltipLabel: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
              tooltipText: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
            }}
          >
            <CustomerFields customerType="representativeWithContacts" hankeUsers={hankeUsers} />
          </FormContact>
        )}

        {!isRepresentative && (
          <Button
            variant="supplementary"
            iconLeft={<IconPlusCircle aria-hidden="true" />}
            onClick={() => addCustomerWithContacts('representativeWithContacts')}
          >
            {t('form:yhteystiedot:titles:addRepresentative')}
          </Button>
        )}
      </Accordion>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Accordion, Button, Fieldset, IconPlusCircle } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import {
  Application,
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
import ContactPersonSelect from '../../hanke/hankeUsers/ContactPersonSelect';
import { HankeUser } from '../../hanke/hankeUsers/hankeUser';
import { useHankeUsers } from '../../hanke/hankeUsers/hooks/useHankeUsers';

function getEmptyCustomerWithContacts(): CustomerWithContacts {
  return {
    customer: {
      yhteystietoId: null,
      type: ContactType.COMPANY,
      name: '',
      email: '',
      phone: '',
      registryKey: null,
    },
    contacts: [],
  };
}

function mapHankeUserToContact({
  id,
  etunimi,
  sukunimi,
  puhelinnumero,
  sahkoposti,
}: HankeUser): Contact {
  return {
    hankekayttajaId: id,
    firstName: etunimi,
    lastName: sukunimi,
    phone: puhelinnumero,
    email: sahkoposti,
  };
}

const CustomerFields: React.FC<{
  customerType: CustomerType;
  hankeUsers?: HankeUser[];
}> = ({ customerType, hankeUsers }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<Application>();

  const [selectedContactType, registryKey] = watch([
    `applicationData.${customerType}.customer.type`,
    `applicationData.${customerType}.customer.registryKey`,
  ]);

  useEffect(() => {
    // If setting contact type to other than company or association, set null to registry key
    if (selectedContactType === 'PERSON' || selectedContactType === 'OTHER') {
      setValue(`applicationData.${customerType}.customer.registryKey`, null, {
        shouldValidate: true,
      });
    }
  }, [selectedContactType, customerType, setValue]);

  useEffect(() => {
    // When emptying registry key field, set its value to null
    if (registryKey === '') {
      setValue(`applicationData.${customerType}.customer.registryKey`, null, {
        shouldValidate: true,
      });
    }
  }, [registryKey, customerType, setValue]);

  function mapContactToLabel(contact: Contact) {
    return `${contact.firstName} ${contact.lastName} (${contact.email})`;
  }

  function removeOrdererFromContact(contact: Contact): Contact {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orderer, ...rest } = contact;
    return rest;
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
        <TextInput
          name={`applicationData.${customerType}.customer.name`}
          label={t('form:yhteystiedot:labels:nimi')}
          required
          autoComplete={selectedContactType === 'PERSON' ? 'name' : 'organization'}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.registryKey`}
          label={t('form:yhteystiedot:labels:ytunnus')}
          disabled={selectedContactType === 'PERSON' || selectedContactType === 'OTHER'}
          autoComplete="on"
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
      <ContactPersonSelect
        name={`applicationData.${customerType}.contacts`}
        hankeUsers={hankeUsers}
        mapHankeUserToValue={mapHankeUserToContact}
        mapValueToLabel={mapContactToLabel}
        transformValue={(value) => removeOrdererFromContact(value)}
        tooltip={{
          tooltipButtonLabel: t('hankeForm:toolTips:tipOpenLabel'),
          tooltipLabel: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
          tooltipText: t('form:yhteystiedot:tooltips:hakemusYhteyshenkilo'),
        }}
      />
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
    queryClient.invalidateQueries(['hankeUsers', hankeTunnus]);
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

      {/* Hakija */}
      <FormContact<CustomerType>
        contactType="customerWithContacts"
        hankeTunnus={hankeTunnus!}
        onContactPersonAdded={(user) =>
          addYhteyshenkiloForYhteystieto('customerWithContacts', user)
        }
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
        <FormContact<CustomerType>
          contactType="contractorWithContacts"
          hankeTunnus={hankeTunnus!}
          onContactPersonAdded={(user) =>
            addYhteyshenkiloForYhteystieto('contractorWithContacts', user)
          }
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
          <FormContact<CustomerType>
            contactType="propertyDeveloperWithContacts"
            hankeTunnus={hankeTunnus!}
            onRemove={handleRemovePropertyDeveloper}
            onContactPersonAdded={(user) =>
              addYhteyshenkiloForYhteystieto('propertyDeveloperWithContacts', user)
            }
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
          <FormContact<CustomerType>
            contactType="representativeWithContacts"
            hankeTunnus={hankeTunnus!}
            onRemove={handleRemoveRepresentative}
            onContactPersonAdded={(user) =>
              addYhteyshenkiloForYhteystieto('representativeWithContacts', user)
            }
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

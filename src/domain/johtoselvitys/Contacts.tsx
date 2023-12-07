import React, { useEffect } from 'react';
import { Accordion, Button, Fieldset, IconCross, IconPlusCircle } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  ContactType,
  CustomerType,
  Contact as ApplicationContact,
  CustomerWithContacts,
  Customer,
} from '../application/types/application';
import styles from './Contacts.module.scss';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import TextInput from '../../common/components/textInput/TextInput';
import Contact from '../forms/components/Contact';
import useLocale from '../../common/hooks/useLocale';
import Dropdown from '../../common/components/dropdown/Dropdown';
import { HankeContacts } from '../types/hanke';
import PreFilledContactSelect from '../application/components/PreFilledContactSelect';
import { JohtoselvitysFormValues } from './types';
import useForceUpdate from '../../common/hooks/useForceUpdate';
import { findOrdererKey } from './utils';

function getEmptyContact(): ApplicationContact {
  return {
    firstName: '',
    lastName: '',
    orderer: false,
    email: '',
    phone: '',
  };
}

function getEmptyCustomerWithContacts(): CustomerWithContacts {
  return {
    customer: {
      type: null,
      name: '',
      country: 'FI',
      email: '',
      phone: '',
      registryKey: null,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [getEmptyContact()],
  };
}

function FillOwnInformationButton({
  onClick,
  testId,
}: {
  onClick: (event: React.MouseEvent) => void;
  testId: string;
}) {
  const { t } = useTranslation();

  return (
    <Button
      className={styles.fillOwnInfoButton}
      variant="supplementary"
      iconLeft
      onClick={onClick}
      data-testid={testId}
    >
      {t('form:buttons:fillWithOwnInformation')}
    </Button>
  );
}

const CustomerFields: React.FC<{
  customerType: CustomerType;
  hankeContacts?: HankeContacts;
  ordererInformation?: ApplicationContact;
}> = ({ customerType, hankeContacts, ordererInformation }) => {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<JohtoselvitysFormValues>();
  const forceUpdate = useForceUpdate();

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

  function handlePreFilledContactChange(customer: Customer) {
    setValue(`applicationData.${customerType}.customer`, customer, { shouldValidate: true });
    forceUpdate();
  }

  function fillWithOrdererInformation() {
    if (ordererInformation !== undefined) {
      setValue(
        `applicationData.${customerType}.customer`,
        {
          type: 'PERSON',
          name: `${ordererInformation.firstName} ${ordererInformation.lastName}`,
          email: ordererInformation.email,
          phone: ordererInformation.phone,
          country: 'FI',
          registryKey: null,
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        { shouldValidate: true, shouldDirty: true },
      );
    }
  }

  return (
    <>
      {hankeContacts && (
        <PreFilledContactSelect
          allHankeContacts={hankeContacts}
          onChange={handlePreFilledContactChange}
        />
      )}
      <Fieldset
        heading={t(`form:yhteystiedot:titles:${customerType}`)}
        style={{ paddingTop: 'var(--spacing-s)' }}
      >
        <ResponsiveGrid>
          <Dropdown
            id={`applicationData.${customerType}.customer.type`}
            name={`applicationData.${customerType}.customer.type`}
            required
            defaultValue={null}
            label={t('form:yhteystiedot:labels:tyyppi')}
            options={$enum(ContactType).map((value) => {
              return {
                value,
                label: t(`form:yhteystiedot:contactType:${value}`),
              };
            })}
          />
          <FillOwnInformationButton
            onClick={fillWithOrdererInformation}
            testId={`applicationData.${customerType}.customer.fillOwnInfoButton`}
          />
        </ResponsiveGrid>
        <ResponsiveGrid>
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
        <ResponsiveGrid>
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
    </>
  );
};

// Yhteyshenkilö
const ContactFields: React.FC<{
  customerType: CustomerType;
  index: number;
  ordererInformation?: ApplicationContact;
  onRemove: () => void;
}> = ({ customerType, index, ordererInformation, onRemove }) => {
  const { t } = useTranslation();
  const { getValues, setValue } = useFormContext<JohtoselvitysFormValues>();

  const orderer = getValues(`applicationData.${customerType}.contacts.${index}.orderer`);
  const contactsLength: number = getValues().applicationData[customerType]?.contacts.length || 0;
  const showRemoveContactButton = !orderer && contactsLength > 1;

  function fillWithOrdererInformation() {
    if (ordererInformation !== undefined) {
      setValue(
        `applicationData.${customerType}.contacts.${index}`,
        {
          ...ordererInformation,
          orderer: false,
        },
        { shouldValidate: true, shouldDirty: true },
      );
    }
  }

  return (
    <Fieldset
      heading={t('form:yhteystiedot:titles:subContactInformation')}
      border
      className={styles.fieldset}
    >
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.firstName`}
          label={t('hankeForm:labels:etunimi')}
          required
          readOnly={orderer}
          autoComplete="given-name"
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.lastName`}
          label={t('hankeForm:labels:sukunimi')}
          required
          readOnly={orderer}
          autoComplete="family-name"
        />
        {!orderer && (
          <FillOwnInformationButton
            onClick={fillWithOrdererInformation}
            testId={`applicationData.${customerType}.contacts.${index}.fillOwnInfoButton`}
          />
        )}
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
          readOnly={orderer}
          autoComplete="email"
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
          readOnly={orderer}
          autoComplete="tel"
        />
        {showRemoveContactButton && (
          <Button
            variant="supplementary"
            iconLeft={<IconCross aria-hidden="true" />}
            onClick={onRemove}
            style={{ alignSelf: 'end' }}
          >
            {t(`form:yhteystiedot:buttons:removeSubContact`)}
          </Button>
        )}
      </ResponsiveGrid>
    </Fieldset>
  );
};

export const Contacts: React.FC<{ hankeContacts?: HankeContacts }> = ({ hankeContacts }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { watch, setValue, getValues } = useFormContext<JohtoselvitysFormValues>();
  const ordererKey = findOrdererKey(getValues('applicationData'));
  const ordererInformation: ApplicationContact | undefined = getValues().applicationData[
    ordererKey
  ]?.contacts.find((contact) => contact.orderer);

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

  return (
    <div>
      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h3" styleAs="h3" weight="light" spacingBottom="s">
        {t('form:yhteystiedot:titles:customerWithContactsInfo')}
      </Text>

      {/* Hakija */}
      <Contact<CustomerType>
        contactType="customerWithContacts"
        subContactPath="applicationData.customerWithContacts.contacts"
        emptySubContact={getEmptyContact()}
        renderSubContact={(subContactIndex, _subContactCount, removeSubContact) => {
          return (
            <ContactFields
              customerType="customerWithContacts"
              index={subContactIndex}
              ordererInformation={ordererInformation}
              onRemove={() => removeSubContact(subContactIndex)}
            />
          );
        }}
      >
        <CustomerFields
          customerType="customerWithContacts"
          hankeContacts={hankeContacts}
          ordererInformation={ordererInformation}
        />
      </Contact>

      {/* Työn suorittaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:contractorInfo')}
        headingLevel={3}
        initiallyOpen
      >
        <Contact<CustomerType>
          contactType="contractorWithContacts"
          subContactPath="applicationData.contractorWithContacts.contacts"
          emptySubContact={getEmptyContact()}
          renderSubContact={(subContactIndex, _subContactCount, removeSubContact) => {
            return (
              <ContactFields
                customerType="contractorWithContacts"
                index={subContactIndex}
                ordererInformation={ordererInformation}
                onRemove={() => removeSubContact(subContactIndex)}
              />
            );
          }}
        >
          <CustomerFields
            customerType="contractorWithContacts"
            hankeContacts={hankeContacts}
            ordererInformation={ordererInformation}
          />
        </Contact>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:propertyDeveloperInfo')}
        headingLevel={3}
        initiallyOpen={isPropertyDeveloper}
      >
        {isPropertyDeveloper && (
          <Contact<CustomerType>
            contactType="propertyDeveloperWithContacts"
            onRemove={handleRemovePropertyDeveloper}
            subContactPath="applicationData.propertyDeveloperWithContacts.contacts"
            emptySubContact={getEmptyContact()}
            renderSubContact={(subContactIndex, _subContactCount, removeSubContact) => {
              return (
                <ContactFields
                  customerType="propertyDeveloperWithContacts"
                  index={subContactIndex}
                  ordererInformation={ordererInformation}
                  onRemove={() => removeSubContact(subContactIndex)}
                />
              );
            }}
          >
            <CustomerFields
              customerType="propertyDeveloperWithContacts"
              hankeContacts={hankeContacts}
              ordererInformation={ordererInformation}
            />
          </Contact>
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
          <Contact<CustomerType>
            contactType="representativeWithContacts"
            onRemove={handleRemoveRepresentative}
            subContactPath="applicationData.representativeWithContacts.contacts"
            emptySubContact={getEmptyContact()}
            renderSubContact={(subContactIndex, _subContactCount, removeSubContact) => {
              return (
                <ContactFields
                  customerType="representativeWithContacts"
                  index={subContactIndex}
                  ordererInformation={ordererInformation}
                  onRemove={() => removeSubContact(subContactIndex)}
                />
              );
            }}
          >
            <CustomerFields
              customerType="representativeWithContacts"
              hankeContacts={hankeContacts}
              ordererInformation={ordererInformation}
            />
          </Contact>
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
};

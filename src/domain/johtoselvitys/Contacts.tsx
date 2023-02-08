import React from 'react';
import { Accordion, Button, Fieldset, IconCross, IconPlusCircle } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  ContactType,
  CustomerType,
  Contact as ApplicationContact,
  CustomerWithContacts,
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

function getEmptyContact(): ApplicationContact {
  return {
    name: '',
    orderer: false,
    postalAddress: {
      streetAddress: { streetName: '' },
      city: '',
      postalCode: '',
    },
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
      postalAddress: {
        streetAddress: {
          streetName: '',
        },
        postalCode: '',
        city: '',
      },
      email: '',
      phone: '',
      registryKey: '',
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [getEmptyContact()],
  };
}

const CustomerFields: React.FC<{ customerType: CustomerType; hankeContacts?: HankeContacts }> = ({
  customerType,
  hankeContacts,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {hankeContacts && (
        <PreFilledContactSelect customerType={customerType} allHankeContacts={hankeContacts} />
      )}
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
        <TextInput
          name={`applicationData.${customerType}.customer.name`}
          label={t('form:yhteystiedot:labels:nimi')}
          required
        />
        <TextInput
          name={`applicationData.${customerType}.customer.registryKey`}
          label={t('form:yhteystiedot:labels:ytunnusTaiHetu')}
          required
        />
        <TextInput
          name={`applicationData.${customerType}.customer.postalAddress.streetAddress.streetName`}
          label={t('form:yhteystiedot:labels:osoite')}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.postalAddress.postalCode`}
          label={t('form:yhteystiedot:labels:postinumero')}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.postalAddress.city`}
          label={t('form:yhteystiedot:labels:postitoimipaikka')}
        />
        <TextInput
          name={`applicationData.${customerType}.customer.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
        />
        <TextInput
          name={`applicationData.${customerType}.customer.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
        />
      </ResponsiveGrid>
    </>
  );
};

// Yhteyshenkilö
const ContactFields: React.FC<{
  customerType: CustomerType;
  index: number;
  onRemove: () => void;
}> = ({ customerType, index, onRemove }) => {
  const { t } = useTranslation();
  const { getValues } = useFormContext();

  const orderer = getValues(`applicationData.${customerType}.contacts.${index}.orderer`);
  const contactsLength: number = getValues().applicationData[customerType]?.contacts.length || 0;
  const showRemoveContactButton = !orderer && contactsLength > 1;

  return (
    <Fieldset
      heading={t('form:yhteystiedot:titles:subContactInformation')}
      border
      className={styles.fieldset}
    >
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.name`}
          label={t('form:yhteystiedot:labels:nimi')}
          required
          readOnly={orderer}
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.postalAddress.streetAddress.streetName`}
          label={t('form:yhteystiedot:labels:osoite')}
          readOnly={orderer}
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.postalAddress.postalCode`}
          label={t('form:yhteystiedot:labels:postinumero')}
          readOnly={orderer}
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.postalAddress.city`}
          label={t('form:yhteystiedot:labels:postitoimipaikka')}
          readOnly={orderer}
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.email`}
          label={t('form:yhteystiedot:labels:email')}
          required
          readOnly={orderer}
        />
        <TextInput
          name={`applicationData.${customerType}.contacts.${index}.phone`}
          label={t('form:yhteystiedot:labels:puhelinnumero')}
          required
          readOnly={orderer}
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
  const { watch, setValue } = useFormContext();

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
      <div className={styles.formInstructions}>
        <Trans i18nKey="johtoselvitysForm:yhteystiedot:instructions">
          <p>
            Hakemukselle lisättävät tahot saavat sähköpostiinsa linkin, jonka kautta he pystyvät
            liittymään hakemukseen Haitattomassa. Tämän jälkeen he pystyvät tarkastelemaan
            hakemusta. Tarvittaessa voit antaa heille laajemmat käyttöoikeudet Omat hankkeet
            -näkymässä.
          </p>
          <p>
            Hakijan yhteyshenkilö on oletuksena johtoselvityksen tilaaja. Tarvittaessa voit vaihtaa
            jonkun muista yhteyshenkilöistä tilaajaksi. Huomioithan, että johtoselvityksen tilaaja
            voi olla vain yksi henkilö.
          </p>
        </Trans>
      </div>

      <Text tag="p" spacingBottom="l">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h2" styleAs="h4" weight="bold" spacingBottom="s">
        {t('form:yhteystiedot:titles:applicant')}
      </Text>

      {/* Hakija */}
      <Contact<CustomerType>
        contactType="customerWithContacts"
        showContactTitle={false}
        subContactPath="applicationData.customerWithContacts.contacts"
        emptySubContact={getEmptyContact()}
        renderSubContact={(subContactIndex, removeSubContact) => {
          return (
            <ContactFields
              customerType="customerWithContacts"
              index={subContactIndex}
              onRemove={() => removeSubContact(subContactIndex)}
            />
          );
        }}
      >
        <CustomerFields customerType="customerWithContacts" hankeContacts={hankeContacts} />
      </Contact>

      {/* Työn suorittaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:addContractors')}
        initiallyOpen
      >
        <Contact<CustomerType>
          contactType="contractorWithContacts"
          subContactPath="applicationData.contractorWithContacts.contacts"
          emptySubContact={getEmptyContact()}
          renderSubContact={(subContactIndex, removeSubContact) => {
            return (
              <ContactFields
                customerType="contractorWithContacts"
                index={subContactIndex}
                onRemove={() => removeSubContact(subContactIndex)}
              />
            );
          }}
        >
          <CustomerFields customerType="contractorWithContacts" hankeContacts={hankeContacts} />
        </Contact>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion
        language={locale}
        heading={t('form:yhteystiedot:titles:lisaaRakennuttajia')}
        initiallyOpen={isPropertyDeveloper}
      >
        {isPropertyDeveloper && (
          <Contact<CustomerType>
            contactType="propertyDeveloperWithContacts"
            onRemoveContact={handleRemovePropertyDeveloper}
            subContactPath="applicationData.propertyDeveloperWithContacts.contacts"
            emptySubContact={getEmptyContact()}
            renderSubContact={(subContactIndex, removeSubContact) => {
              return (
                <ContactFields
                  customerType="propertyDeveloperWithContacts"
                  index={subContactIndex}
                  onRemove={() => removeSubContact(subContactIndex)}
                />
              );
            }}
          >
            <CustomerFields
              customerType="propertyDeveloperWithContacts"
              hankeContacts={hankeContacts}
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
        heading={t('form:yhteystiedot:titles:addRepresentatives')}
        initiallyOpen={isRepresentative}
      >
        {isRepresentative && (
          <Contact<CustomerType>
            contactType="representativeWithContacts"
            onRemoveContact={handleRemoveRepresentative}
            subContactPath="applicationData.representativeWithContacts.contacts"
            emptySubContact={getEmptyContact()}
            renderSubContact={(subContactIndex, removeSubContact) => {
              return (
                <ContactFields
                  customerType="representativeWithContacts"
                  index={subContactIndex}
                  onRemove={() => removeSubContact(subContactIndex)}
                />
              );
            }}
          >
            <CustomerFields
              customerType="representativeWithContacts"
              hankeContacts={hankeContacts}
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

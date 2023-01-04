import React from 'react';
import { Accordion, Button, Fieldset, IconCross } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Trans, useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { ContactType, CustomerType, Contact as ApplicationContact } from './types';
import styles from './Contacts.module.scss';
import Text from '../../common/components/text/Text';
import ResponsiveGrid from '../../common/components/grid/ResponsiveGrid';
import TextInput from '../../common/components/textInput/TextInput';
import Contact from '../forms/components/Contact';
import useLocale from '../../common/hooks/useLocale';
import Dropdown from '../../common/components/dropdown/Dropdown';

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

const CustomerFields: React.FC<{ customerType: CustomerType }> = ({ customerType }) => {
  const { t } = useTranslation();

  return (
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
        {!orderer && (
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

export const Contacts: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

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

      {/* Työstä vastaava */}
      <Contact<CustomerType>
        contactType="customerWithContacts"
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
        <CustomerFields customerType="customerWithContacts" />
      </Contact>

      {/* Työn suorittaja */}
      <Accordion language={locale} heading={t('form:yhteystiedot:titles:addContractors')}>
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
          <CustomerFields customerType="contractorWithContacts" />
        </Contact>
      </Accordion>

      {/* Rakennuttaja */}
      <Accordion language={locale} heading={t('form:yhteystiedot:titles:lisaaRakennuttajia')}>
        <Contact<CustomerType>
          contactType="propertyDeveloperWithContacts"
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
          <CustomerFields customerType="propertyDeveloperWithContacts" />
        </Contact>
      </Accordion>

      {/* Asianhoitaja */}
      <Accordion language={locale} heading={t('form:yhteystiedot:titles:addRepresentatives')}>
        <Contact<CustomerType>
          contactType="representativeWithContacts"
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
          <CustomerFields customerType="representativeWithContacts" />
        </Contact>
      </Accordion>
    </div>
  );
};
export default Contacts;

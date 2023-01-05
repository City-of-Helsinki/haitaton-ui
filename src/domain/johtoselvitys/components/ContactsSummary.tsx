import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@chakra-ui/react';
import { SectionItemContent, SectionItemTitle } from '../../forms/components/FormSummarySection';
import { Contact, Customer, CustomerWithContacts, PostalAddress } from '../types';
import Text from '../../../common/components/text/Text';

function isCustomerEmpty(customer: Customer) {
  if (
    customer.name === '' &&
    customer.registryKey === '' &&
    customer.email === '' &&
    customer.phone === '' &&
    customer.postalAddress.streetAddress.streetName === '' &&
    customer.postalAddress.postalCode === '' &&
    customer.postalAddress.city === ''
  ) {
    return true;
  }
  return false;
}

const AddressSummary: React.FC<{ postalAddress: PostalAddress }> = ({ postalAddress }) => {
  return (
    <>
      <p>{postalAddress.streetAddress.streetName}</p>
      <p>
        {postalAddress.postalCode} {postalAddress.city}
      </p>
    </>
  );
};

const CustomerSummary: React.FC<{ customer: Customer }> = ({ customer }) => {
  return (
    <Box marginBottom="var(--spacing-s)">
      <Text tag="h3" weight="bold" spacingBottom="xs">
        {customer.name}
      </Text>
      <p>{customer.registryKey}</p>
      <p>{customer.email}</p>
      <p>{customer.phone}</p>
      <AddressSummary postalAddress={customer.postalAddress} />
    </Box>
  );
};

export const ContactSummary: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div>
      <p>{contact.name}</p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
      <AddressSummary postalAddress={contact.postalAddress} />
    </div>
  );
};

const ContactsSummary: React.FC<{ customerWithContacts: CustomerWithContacts; title: string }> = ({
  customerWithContacts,
  title,
}) => {
  const { t } = useTranslation();

  if (isCustomerEmpty(customerWithContacts.customer)) {
    return null;
  }

  return (
    <>
      <SectionItemTitle>{title}</SectionItemTitle>
      <SectionItemContent>
        <CustomerSummary customer={customerWithContacts.customer} />
        {customerWithContacts.contacts.length > 0 && (
          <>
            <Text tag="h3" weight="bold">
              {t('form:yhteystiedot:titles:subContacts')}
            </Text>
            <Grid
              templateColumns="repeat(auto-fit, minmax(280px, 290px))"
              gap={15}
              justifyContent="start"
              alignItems="start"
            >
              {customerWithContacts.contacts.map((contact) => {
                return <ContactSummary key={contact.email} contact={contact} />;
              })}
            </Grid>
          </>
        )}
      </SectionItemContent>
    </>
  );
};

export default ContactsSummary;

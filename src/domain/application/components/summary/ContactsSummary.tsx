import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@chakra-ui/react';
import { SectionItemContent, SectionItemTitle } from '../../../forms/components/FormSummarySection';
import { Contact, Customer, CustomerWithContacts } from '../../types/application';
import Text from '../../../../common/components/text/Text';

function isCustomerEmpty(customer?: Customer) {
  if (customer === undefined) {
    return true;
  }

  if (
    customer.name === '' &&
    !customer.registryKey &&
    customer.email === '' &&
    customer.phone === ''
  ) {
    return true;
  }
  return false;
}

const CustomerSummary: React.FC<{ customer: Customer }> = ({ customer }) => {
  return (
    <Box marginBottom="var(--spacing-s)">
      <Text tag="h3" weight="bold" spacingBottom="xs">
        {customer.name}
      </Text>
      <p>{customer.registryKey}</p>
      <p>{customer.email}</p>
      <p>{customer.phone}</p>
    </Box>
  );
};

export const ContactSummary: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div>
      <p>
        {contact.firstName} {contact.lastName}
      </p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </div>
  );
};

const ContactsSummary: React.FC<{
  customerWithContacts?: CustomerWithContacts | null;
  ContentContainer?: JSX.ElementType;
  title: string;
}> = ({ customerWithContacts, ContentContainer = SectionItemContent, title }) => {
  const { t } = useTranslation();

  if (!customerWithContacts || isCustomerEmpty(customerWithContacts.customer)) {
    return null;
  }

  return (
    <>
      <SectionItemTitle>{title}</SectionItemTitle>
      <ContentContainer>
        <CustomerSummary customer={customerWithContacts.customer} />
        {customerWithContacts.contacts.length > 0 && (
          <>
            <Text tag="h3" weight="bold" spacingBottom="xs">
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
      </ContentContainer>
    </>
  );
};

export default ContactsSummary;

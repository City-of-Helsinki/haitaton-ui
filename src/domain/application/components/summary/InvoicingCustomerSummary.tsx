import { Box } from '@chakra-ui/react';
import { SectionItemContent, SectionItemTitle } from '../../../forms/components/FormSummarySection';
import { InvoicingCustomer } from '../../types/application';
import React from 'react';

function isInvoicingCustomerEmpty(invoicingCustomer: InvoicingCustomer) {
  return (
    !invoicingCustomer.name &&
    !invoicingCustomer.registryKey &&
    !invoicingCustomer.ovt &&
    !invoicingCustomer.invoicingOperator &&
    !invoicingCustomer.customerReference &&
    !invoicingCustomer.postalAddress.streetAddress.streetName &&
    !invoicingCustomer.postalAddress.postalCode &&
    !invoicingCustomer.postalAddress.city &&
    !invoicingCustomer.email &&
    !invoicingCustomer.phone
  );
}

type Props = {
  invoicingCustomer?: InvoicingCustomer | null;
  ContentContainer?: JSX.ElementType;
  title?: string;
};

export default function InvoicingCustomerSummary({
  invoicingCustomer,
  ContentContainer = SectionItemContent,
  title,
}: Readonly<Props>) {
  if (!invoicingCustomer || isInvoicingCustomerEmpty(invoicingCustomer)) {
    return null;
  }

  return (
    <>
      {title ? <SectionItemTitle>{title}</SectionItemTitle> : <div />}
      <ContentContainer>
        {invoicingCustomer && (
          <div>
            <Box marginBottom="var(--spacing-xs)">
              <p>{invoicingCustomer.name}</p>
              <p>{invoicingCustomer.registryKey}</p>
            </Box>
            <Box marginBottom="var(--spacing-xs)">
              <p>{invoicingCustomer.ovt}</p>
              <p>{invoicingCustomer.invoicingOperator}</p>
              <p>{invoicingCustomer.customerReference}</p>
            </Box>
            <Box marginBottom="var(--spacing-xs)">
              <p>{invoicingCustomer.postalAddress.streetAddress.streetName}</p>
              <p>
                {invoicingCustomer.postalAddress.postalCode} {invoicingCustomer?.postalAddress.city}
              </p>
            </Box>
            <div>
              <p>{invoicingCustomer.phone}</p>
              <p>{invoicingCustomer.email}</p>
            </div>
          </div>
        )}
      </ContentContainer>
    </>
  );
}

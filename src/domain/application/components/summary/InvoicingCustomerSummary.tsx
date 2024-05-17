import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { SectionItemContent, SectionItemTitle } from '../../../forms/components/FormSummarySection';
import { InvoicingCustomer } from '../../types/application';

function isInvoicingCustomerEmpty(invoicingCustomer: InvoicingCustomer) {
  if (
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
  ) {
    return true;
  }
  return false;
}

type Props = {
  invoicingCustomer?: InvoicingCustomer | null;
};

export default function InvoicingCustomerSummary({ invoicingCustomer }: Readonly<Props>) {
  const { t } = useTranslation();

  if (!invoicingCustomer || isInvoicingCustomerEmpty(invoicingCustomer)) {
    return null;
  }

  return (
    <>
      <SectionItemTitle>{t('form:yhteystiedot:titles:invoicingCustomerInfo')}</SectionItemTitle>
      <SectionItemContent>
        <div>
          <Box marginBottom="var(--spacing-s)">
            <p>{invoicingCustomer.name}</p>
            <p>{invoicingCustomer.registryKey}</p>
          </Box>
          <Box marginBottom="var(--spacing-s)">
            <p>{invoicingCustomer.ovt}</p>
            <p>{invoicingCustomer.invoicingOperator}</p>
            <p>{invoicingCustomer.customerReference}</p>
          </Box>
          <Box marginBottom="var(--spacing-s)">
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
      </SectionItemContent>
    </>
  );
}

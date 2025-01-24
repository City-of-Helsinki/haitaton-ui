import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import {
  SectionItemContent,
  SectionItemContentAdded,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
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
  taydennysInvoicingCustomer?: InvoicingCustomer | null;
};

export default function InvoicingCustomerSummary({
  invoicingCustomer,
  taydennysInvoicingCustomer,
}: Readonly<Props>) {
  const { t } = useTranslation();

  if (
    (!invoicingCustomer || isInvoicingCustomerEmpty(invoicingCustomer)) &&
    (!taydennysInvoicingCustomer || isInvoicingCustomerEmpty(taydennysInvoicingCustomer))
  ) {
    return null;
  }

  return (
    <>
      <SectionItemTitle>{t('form:yhteystiedot:titles:invoicingCustomerInfo')}</SectionItemTitle>
      <SectionItemContent>
        {invoicingCustomer && (
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
        )}
        {taydennysInvoicingCustomer && taydennysInvoicingCustomer !== invoicingCustomer && (
          <SectionItemContentAdded>
            <Box marginBottom="var(--spacing-s)">
              <p>{taydennysInvoicingCustomer.name}</p>
              <p>{taydennysInvoicingCustomer.registryKey}</p>
            </Box>
            <Box marginBottom="var(--spacing-s)">
              <p>{taydennysInvoicingCustomer.ovt}</p>
              <p>{taydennysInvoicingCustomer.invoicingOperator}</p>
              <p>{taydennysInvoicingCustomer.customerReference}</p>
            </Box>
            <Box marginBottom="var(--spacing-s)">
              <p>{taydennysInvoicingCustomer.postalAddress.streetAddress.streetName}</p>
              <p>
                {taydennysInvoicingCustomer.postalAddress.postalCode}{' '}
                {invoicingCustomer?.postalAddress.city}
              </p>
            </Box>
            <div>
              <p>{taydennysInvoicingCustomer.phone}</p>
              <p>{taydennysInvoicingCustomer.email}</p>
            </div>
          </SectionItemContentAdded>
        )}
      </SectionItemContent>
    </>
  );
}

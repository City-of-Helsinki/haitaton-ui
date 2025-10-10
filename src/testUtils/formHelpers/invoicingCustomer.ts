import { screen } from '../../testUtils/render';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

/**
 * Fill invoicing customer section fields. Accepts partial overrides; undefined values are skipped.
 * Each field is cleared before typing to ensure deterministic state; blur is triggered to fire validation.
 */
export async function fillInvoicingCustomer(
  user: UserEvent,
  data: {
    name?: string;
    ovt?: string;
    invoicingOperator?: string;
    registryKey?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
  },
): Promise<void> {
  async function clearAndMaybeType(testId: string, value: string | undefined) {
    if (value === undefined) return;
    const el = screen.getByTestId(testId);
    await user.clear(el);
    // user.type with empty string throws; skipping typing preserves empty state after clear
    if (value !== '') {
      await user.type(el, value);
    }
    (el as HTMLInputElement).blur();
  }

  await clearAndMaybeType('applicationData.invoicingCustomer.name', data.name);
  await clearAndMaybeType('applicationData.invoicingCustomer.ovt', data.ovt);
  await clearAndMaybeType(
    'applicationData.invoicingCustomer.invoicingOperator',
    data.invoicingOperator,
  );
  await clearAndMaybeType('applicationData.invoicingCustomer.registryKey', data.registryKey);
  await clearAndMaybeType(
    'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
    data.streetAddress,
  );
  await clearAndMaybeType(
    'applicationData.invoicingCustomer.postalAddress.postalCode',
    data.postalCode,
  );
  await clearAndMaybeType('applicationData.invoicingCustomer.postalAddress.city', data.city);
}

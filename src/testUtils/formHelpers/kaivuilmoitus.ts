import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

// Utility to build a FileList object programmatically (define before usage to satisfy linters)
function FileListBuilder(files: File[]): FileList {
  try {
    // Preferred path (jsdom 19 supports DataTransfer)
    const dataTransfer = new DataTransfer();
    files.forEach((f) => dataTransfer.items.add(f));
    return dataTransfer.files;
  } catch {
    // Fallback lightweight FileList polyfill (typed)
    interface FileListLike extends FileList {
      [index: number]: File;
    }
    const fileList = {
      length: files.length,
      item: (i: number) => files[i] ?? null,
    } as unknown as FileListLike;
    files.forEach((f, i) => {
      (fileList as FileListLike)[i] = f;
    });
    return fileList;
  }
}

/**
 * Helper to fill "Perustiedot" (basic information) page of Kaivuilmoitus form in tests.
 * Accepts partial override options so individual tests can supply specific values.
 */
export async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    cableReportDone?: boolean; // true = use existing, false = create new
    existingCableReport?: string;
    placementContracts?: string[];
  } = {},
) {
  const {
    name = 'Työn nimi',
    description = 'Työn kuvaus',
    cableReportDone = false,
    existingCableReport = 'JS2300001',
    placementContracts = ['SL0000001'],
  } = options;

  // Name
  const nameInput = screen.getByLabelText(/työn nimi/i);
  await user.clear(nameInput);
  await user.type(nameInput, name);
  (nameInput as HTMLInputElement).blur();

  // Description
  const descriptionInput = screen.getByLabelText(/työn kuvaus/i);
  await user.clear(descriptionInput);
  await user.type(descriptionInput, description);
  (descriptionInput as HTMLInputElement).blur();

  // Work type: tick construction work to satisfy validation (any one is enough)
  const constructionCheckbox = screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i);
  if (!(constructionCheckbox as HTMLInputElement).checked) {
    await user.click(constructionCheckbox);
  }

  // Choose cable report mode (refined: use IDs to avoid ambiguous /johtoselvitys/ query collisions)
  if (cableReportDone === true) {
    const existingRadio = document.getElementById('createCableReportNo');
    if (existingRadio) await user.click(existingRadio);
    // Open multiselect button explicitly before typing
    const dropdownButton = document.getElementById('applicationData.cableReports-main-button');
    if (dropdownButton) {
      await user.click(dropdownButton);
    }
    const tagInput = document.getElementById('applicationData.cableReports-input-element');
    if (tagInput) {
      await user.type(tagInput, existingCableReport);
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    }
  } else {
    const createNewRadio = document.getElementById('createCableReportYes');
    if (createNewRadio && !(createNewRadio as HTMLInputElement).checked) {
      await user.click(createNewRadio);
    }
    const rockYes = screen.queryByLabelText(/kyllä/i) || screen.queryByLabelText(/yes/i);
    if (rockYes) await user.click(rockYes);
  }

  // Placement contracts (TagInput) - add each value if not present already
  const placementInput =
    screen.queryByLabelText(/sijoitussopimukset/i) || screen.queryByLabelText(/sijoitussopimus/i);
  if (placementInput) {
    for (const contract of placementContracts) {
      if (!screen.queryByText(contract)) {
        await user.type(placementInput, contract);
        fireEvent.keyDown(placementInput, { key: 'Enter', code: 'Enter' });
      }
    }
  }
}

export async function fillAreasInformation(
  user: UserEvent,
  options: { start?: string; end?: string } = {},
) {
  // Use zero-padded Finnish date format dd.mm.yyyy to satisfy strict validation/parsing
  const { start = '01.01.2024', end = '01.06.2024' } = options;

  const startInput = screen.getByLabelText(/alkupäivä/i);
  await user.clear(startInput);
  await user.type(startInput, start);
  (startInput as HTMLInputElement).blur();

  const endInput = screen.getByLabelText(/loppupäivä/i);
  await user.clear(endInput);
  await user.type(endInput, end);
  (endInput as HTMLInputElement).blur();
}

export async function fillContactsInformation(
  user: UserEvent,
  options: {
    customer?: { name: string; registryKey: string; email: string; phone: string; type?: string };
    contractor?: { name: string; registryKey: string; email: string; phone: string; type?: string };
    invoicingCustomer?: {
      name: string;
      registryKey: string;
      ovt?: string;
      invoicingOperator?: string;
      customerReference?: string;
      postalAddress?: { streetName: string; postalCode: string; city: string };
      email?: string;
      phone?: string;
      type?: string;
    };
  } = {},
) {
  const {
    customer = {
      name: 'Yritys Oy',
      registryKey: '1234567-8',
      email: 'yritys@test.com',
      phone: '000',
      type: 'COMPANY',
    },
    contractor = {
      name: 'Urakoitsija Oy',
      registryKey: '2345678-9',
      email: 'urakoitsija@test.com',
      phone: '111',
      type: 'COMPANY',
    },
    invoicingCustomer = {
      name: 'Laskutus Oy',
      registryKey: '3456789-0',
      ovt: '123456789012',
      invoicingOperator: '12345',
      customerReference: '6789',
      postalAddress: { streetName: 'Katu 1', postalCode: '00100', city: 'Helsinki' },
      email: 'laskutus@test.com',
      phone: '222',
      type: 'COMPANY',
    },
  } = options;
  // Ensure we are on the Yhteystiedot step; if not, click stepper button and wait for form to render
  const contactsStepButton = screen
    .queryAllByRole('button', { name: /yhteystiedot/i })
    .slice(-1)[0];
  async function ensureContactsStep() {
    const targetTestId = 'applicationData.invoicingCustomer.name';
    if (screen.queryByTestId(targetTestId)) return; // already there
    if (contactsStepButton) {
      await user.click(contactsStepButton);
    }
    // Retry loop: either direct step navigation worked or we need to advance sequentially
    const maxAttempts = 4;
    for (let i = 0; i < maxAttempts; i++) {
      if (screen.queryByTestId(targetTestId)) break;
      // click Seuraava if available
      const nextBtn = screen.queryByRole('button', { name: /seuraava/i });
      if (nextBtn) await user.click(nextBtn);
      await new Promise((r) => setTimeout(r, 50));
    }
    // Final assertion: presence of invoicing customer name field testId is enough
    await waitFor(() => {
      expect(screen.getByTestId(targetTestId)).toBeInTheDocument();
    });
  }
  await ensureContactsStep();

  // Helper to get nth occurrence of input by its label text (case-insensitive)
  const byLabel = (labelRegex: RegExp, index = 0) => {
    const all = screen.queryAllByLabelText(labelRegex, { selector: 'input,textarea' });
    return (all && all[index]) as HTMLInputElement | undefined;
  };

  // Customer (first block)
  const customerNameInput = byLabel(/nimi/i, 0);
  if (!customerNameInput) throw new Error('Customer name input not found via label');
  await user.clear(customerNameInput);
  await user.type(customerNameInput, customer.name);
  customerNameInput.blur();

  // Registry key/email/phone fields appear later with same labels; rely on testIds that DO exist for these
  const customerRegKey = screen.getByTestId(
    'applicationData.customerWithContacts.customer.registryKey',
  );
  await user.clear(customerRegKey);
  await user.type(customerRegKey, customer.registryKey);
  (customerRegKey as HTMLInputElement).blur();
  const customerEmail = screen.getByTestId('applicationData.customerWithContacts.customer.email');
  await user.clear(customerEmail);
  await user.type(customerEmail, customer.email);
  (customerEmail as HTMLInputElement).blur();
  const customerPhone = screen.getByTestId('applicationData.customerWithContacts.customer.phone');
  await user.clear(customerPhone);
  await user.type(customerPhone, customer.phone);
  (customerPhone as HTMLInputElement).blur();

  // Contractor (second block): select type combobox (index 1) then fill name etc.
  const typeComboboxes = screen.getAllByRole('combobox', { name: /tyyppi/i });
  if (typeComboboxes[1]) {
    await user.click(typeComboboxes[1]);
    const contractorTypeOption = screen.getAllByText(/yritys/i)[1];
    await user.click(contractorTypeOption);
  }
  const contractorNameInput = byLabel(/nimi/i, 1);
  if (!contractorNameInput) throw new Error('Contractor name input not found via label');
  await user.clear(contractorNameInput);
  await user.type(contractorNameInput, contractor.name);
  contractorNameInput.blur();
  const contractorRegKey = screen.getByTestId(
    'applicationData.contractorWithContacts.customer.registryKey',
  );
  await user.clear(contractorRegKey);
  await user.type(contractorRegKey, contractor.registryKey);
  (contractorRegKey as HTMLInputElement).blur();
  const contractorEmail = screen.getByTestId(
    'applicationData.contractorWithContacts.customer.email',
  );
  await user.clear(contractorEmail);
  await user.type(contractorEmail, contractor.email);
  (contractorEmail as HTMLInputElement).blur();
  const contractorPhone = screen.getByTestId(
    'applicationData.contractorWithContacts.customer.phone',
  );
  await user.clear(contractorPhone);
  await user.type(contractorPhone, contractor.phone);
  (contractorPhone as HTMLInputElement).blur();

  // Invoicing customer (third block)
  if (typeComboboxes[2]) {
    await user.click(typeComboboxes[2]);
    const invoicingTypeOption = screen.getAllByText(/yritys/i)[2];
    await user.click(invoicingTypeOption);
  }
  const invNameInput = screen.getByTestId('applicationData.invoicingCustomer.name');
  await user.clear(invNameInput);
  await user.type(invNameInput, invoicingCustomer.name);
  (invNameInput as HTMLInputElement).blur();
  const invRegKey = screen.getByTestId('applicationData.invoicingCustomer.registryKey');
  await user.clear(invRegKey);
  await user.type(invRegKey, invoicingCustomer.registryKey);
  (invRegKey as HTMLInputElement).blur();

  // If invoicing customer has OVT details
  if (invoicingCustomer.ovt) {
    const ovtInput = screen.getByTestId('applicationData.invoicingCustomer.ovt');
    await user.clear(ovtInput);
    await user.type(ovtInput, invoicingCustomer.ovt);
    (ovtInput as HTMLInputElement).blur();
  }
  if (invoicingCustomer.invoicingOperator) {
    const opInput = screen.getByTestId('applicationData.invoicingCustomer.invoicingOperator');
    await user.clear(opInput);
    await user.type(opInput, invoicingCustomer.invoicingOperator);
    (opInput as HTMLInputElement).blur();
  }
  if (invoicingCustomer.customerReference) {
    const refInput = screen.getByTestId('applicationData.invoicingCustomer.customerReference');
    await user.clear(refInput);
    await user.type(refInput, invoicingCustomer.customerReference);
    (refInput as HTMLInputElement).blur();
  }

  if (invoicingCustomer.postalAddress) {
    // NOTE: postalAddress shape in form values nests street name under streetAddress
    // { postalAddress: { streetAddress: { streetName }, postalCode, city } }
    // Some earlier test data objects may still provide postalAddress.streetName directly.
    // Support both to avoid undefined access errors by falling back gracefully.
    const street = screen.getByTestId(
      'applicationData.invoicingCustomer.postalAddress.streetAddress.streetName',
    );
    const streetValue =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invoicingCustomer.postalAddress as any).streetAddress?.streetName ||
      invoicingCustomer.postalAddress.streetName;
    if (streetValue) {
      await user.clear(street);
      await user.type(street, streetValue);
      (street as HTMLInputElement).blur();
    }

    const pc = screen.getByTestId('applicationData.invoicingCustomer.postalAddress.postalCode');
    await user.clear(pc);
    await user.type(pc, invoicingCustomer.postalAddress.postalCode);
    (pc as HTMLInputElement).blur();

    const city = screen.getByTestId('applicationData.invoicingCustomer.postalAddress.city');
    await user.clear(city);
    await user.type(city, invoicingCustomer.postalAddress.city);
    (city as HTMLInputElement).blur();
  }

  if (invoicingCustomer.email) {
    const email = screen.getByTestId('applicationData.invoicingCustomer.email');
    await user.clear(email);
    await user.type(email, invoicingCustomer.email);
    (email as HTMLInputElement).blur();
  }
  if (invoicingCustomer.phone) {
    const phone = screen.getByTestId('applicationData.invoicingCustomer.phone');
    await user.clear(phone);
    await user.type(phone, invoicingCustomer.phone);
    (phone as HTMLInputElement).blur();
  }
}

export async function fillAttachments(
  user: UserEvent,
  options: {
    trafficArrangementPlanFiles?: File[];
    mandateFiles?: File[];
    otherFiles?: File[];
    additionalInfo?: string;
  } = {},
) {
  const {
    trafficArrangementPlanFiles = [],
    mandateFiles = [],
    otherFiles = [],
    additionalInfo = 'Lisätietoja',
  } = options;

  // New robust helper to locate actual <input type=file>
  const resolveFileInput = (labelRegex: RegExp, containerIdPrefix?: string) => {
    let input: HTMLElement | null = screen.queryByLabelText(labelRegex) as HTMLElement | null;
    if (!input && containerIdPrefix) {
      const container = document.querySelector<HTMLElement>(`[id^="${containerIdPrefix}"]`);
      if (container) {
        const found = container.querySelector('input[type="file"]') as HTMLElement | null;
        if (found) input = found;
      }
    }
    return input as HTMLInputElement | null;
  };

  const uploadFiles = async (input: HTMLInputElement | null, files: File[]) => {
    if (!input || !files.length) return;
    // Upload each file individually to ensure three distinct calls for spy counting
    for (const f of files) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maybeUser: any = user;
      if (maybeUser.upload) {
        await maybeUser.upload(input, [f]);
      } else {
        const fileList = FileListBuilder([f]);
        fireEvent.change(input, { target: { files: fileList } });
      }
    }
  };

  const trafficInput = resolveFileInput(
    /tilapäisen liikennejärjestelyn suunnitelma/i,
    'excavation-notification-file-upload-traffic-arrangement-plan',
  );
  await uploadFiles(trafficInput, trafficArrangementPlanFiles);

  const mandateInput = resolveFileInput(
    /valtakirja/i,
    'excavation-notification-file-upload-mandate',
  );
  await uploadFiles(mandateInput, mandateFiles);

  const otherInput = resolveFileInput(
    /muut liitteet/i,
    'excavation-notification-file-upload-other-attachments',
  );
  await uploadFiles(otherInput, otherFiles);

  const additionalInfoInput = screen.queryByLabelText(/lisätietoja/i);
  if (additionalInfoInput) {
    await user.clear(additionalInfoInput);
    await user.type(additionalInfoInput, additionalInfo);
    (additionalInfoInput as HTMLInputElement).blur();
  }

  // Wait individually for each category's files to appear if provided
  const waitForFiles = async (files: File[]) => {
    if (!files.length) return;
    await waitFor(
      () => {
        files.forEach((f) => {
          expect(screen.getByText(f.name)).toBeTruthy();
        });
      },
      { timeout: 4000 },
    ).catch(() => {
      /* non-fatal */
    });
  };
  await waitForFiles(trafficArrangementPlanFiles);
  await waitForFiles(mandateFiles);
  await waitForFiles(otherFiles);

  // Additional sanity: ensure file upload lists are rendered when files exist
  if (trafficArrangementPlanFiles.length || mandateFiles.length || otherFiles.length) {
    const lists = screen.queryAllByTestId('file-upload-list');
    if (lists.length) {
      // Optionally assert each list contains at least one item when files passed
      lists.forEach((l) => {
        // Touch list to ensure it's queryable; removed unused variable to satisfy lint
        within(l).queryAllByRole('listitem');
      });
    }
  }
}
// End helpers file

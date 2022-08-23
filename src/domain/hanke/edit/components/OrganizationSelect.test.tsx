import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { cleanup, fireEvent } from '@testing-library/react';
import { HankeDataFormState } from '../types';
import { HANKE_CONTACT_TYPE } from '../../../types/hanke';
import OrganizationSelect from './OrganizationSelect';
import { render } from '../../../../testUtils/render';

afterEach(cleanup);

const defaultContact = {
  id: 1,
  sukunimi: 'Pekkala',
  etunimi: 'Pekka',
  email: 'pekka.pekkala@pekkapekkala.com',
  puhelinnumero: '666',
  osasto: 'Alakerta',
};

const formData = {
  omistajat: [defaultContact],
  toteuttajat: [],
  arvioijat: [],
};

const contactType = HANKE_CONTACT_TYPE.OMISTAJAT;
const index = 0;

const organizations = [
  { nimi: 'Foo', id: 1, tunnus: 'foo' },
  { nimi: 'Bar', id: 2, tunnus: 'bar' },
];

const HankeFormTestContainer: React.FC<{
  children: React.ReactNode;
  valuesOverwrite?: Record<string, unknown>;
}> = ({ children, valuesOverwrite = {} }) => {
  const formContext = useForm<HankeDataFormState>({
    mode: 'all',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: false,
    shouldUnregister: false,
    defaultValues: { ...formData, ...valuesOverwrite },
  });

  return (
    <FormProvider {...formContext}>
      <form>{children}</form>
    </FormProvider>
  );
};

describe('OrganizationSelect inputs can be controlled with props and isOmaOrganisaatio-checkboc', () => {
  test('checking omaOrganisaatio should enable and disable inputs correctly', async () => {
    const { getByTestId, getAllByLabelText } = render(
      <HankeFormTestContainer>
        <OrganizationSelect
          contactType={contactType}
          organizations={organizations}
          isOwnOrganization={false}
          index={index}
        />
      </HankeFormTestContainer>
    );
    expect(getByTestId(`${contactType}-${index}-isOmaOrganisaatio`)).not.toBeChecked();
    getByTestId(`${contactType}-${index}-isOmaOrganisaatio`).click();
    expect(getByTestId(`${contactType}-${index}-isOmaOrganisaatio`)).toBeChecked();
    expect(getAllByLabelText('Organisaatio')[0]).toBeDisabled();
    expect(getByTestId(`${contactType}-${index}-organisaatioNimi`)).not.toBeDisabled();
  });

  test('checking omaOrganisaatio should clear inputs correctly', async () => {
    const { container, getByTestId, getAllByLabelText, queryAllByText } = render(
      <HankeFormTestContainer>
        <OrganizationSelect
          contactType={contactType}
          organizations={organizations}
          isOwnOrganization={false}
          index={index}
        />
      </HankeFormTestContainer>
    );

    const autocompleteToggle = container.querySelector(
      `#${contactType}-${index}-organizationAutocomplete-toggle-button`
    );
    expect(autocompleteToggle).not.toBeNull();

    if (autocompleteToggle) fireEvent.click(autocompleteToggle);

    queryAllByText('Foo')[0].click();
    expect(getAllByLabelText('Organisaatio')[0]).toHaveValue('Foo');

    getByTestId(`${contactType}-${index}-isOmaOrganisaatio`).click();

    expect(getAllByLabelText('Organisaatio')[0]).toHaveValue('');

    fireEvent.change(getByTestId(`${contactType}-${index}-organisaatioNimi`), {
      target: { value: 'Oma' },
    });
    expect(getByTestId(`${contactType}-${index}-organisaatioNimi`)).toHaveValue('Oma');
    getByTestId(`${contactType}-${index}-isOmaOrganisaatio`).click();
    expect(getByTestId(`${contactType}-${index}-organisaatioNimi`)).toHaveValue('');
    expect(getAllByLabelText('Organisaatio')[0]).toHaveValue('');
  });

  test('organisaatio autocomplete should be populated correctly by organisaatioId', async () => {
    const { getAllByLabelText } = render(
      <HankeFormTestContainer
        valuesOverwrite={{
          omistajat: [
            {
              ...defaultContact,
              organisaatioId: 1,
              organisaatioNimi: '',
            },
          ],
        }}
      >
        <OrganizationSelect
          contactType={contactType}
          organizations={organizations}
          isOwnOrganization={false}
          index={index}
        />
      </HankeFormTestContainer>
    );

    expect(getAllByLabelText('Organisaatio')[0]).toHaveValue('Foo');
  });

  test('organisaatioNimi should be populated correctly', async () => {
    const { getByTestId } = render(
      <HankeFormTestContainer
        valuesOverwrite={{
          omistajat: [
            {
              ...defaultContact,
              organisaatioId: null,
              organisaatioNimi: 'Oma',
            },
          ],
        }}
      >
        <OrganizationSelect
          contactType={contactType}
          organizations={organizations}
          isOwnOrganization
          index={index}
        />
      </HankeFormTestContainer>
    );

    expect(getByTestId(`${contactType}-${index}-organisaatioNimi`)).toHaveValue('Oma');
  });
});

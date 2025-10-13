import React from 'react';
import { render, screen } from '../../../testUtils/render';
import AreaSummary from './AreaSummary';
import { KaivuilmoitusFormValues } from '../types';

// Regression test: AreaSummary should not crash when tyoalue objects lack openlayersFeature.
// It should fall back to zero-area polygon and still render total area and list entries.

describe('AreaSummary missing geometry regression', () => {
  it('renders without crashing and shows zero area when tyoalue lacks geometry', () => {
    const formData: KaivuilmoitusFormValues = {
      id: 1,
      applicationIdentifier: 'A-1',
      version: 1,
      createdAt: undefined,
      modifiedAt: undefined,
      paatokset: [],
      applicationType: 'KAIVUILMOITUS',
      applicationData: {
        startTime: '2025-01-01',
        endTime: '2025-01-31',
        areas: [
          {
            hankealueId: 10,
            name: 'Testialue',
            katuosoite: 'Testikatu 1',
            tyoalueet: [
              // Missing openlayersFeature and geometry coordinates
              { geometry: undefined },
            ],
            tyonTarkoitukset: [],
            meluhaitta: undefined,
            polyhaitta: undefined,
            tarinahaitta: undefined,
            kaistahaitta: undefined,
            kaistahaittojenPituus: undefined,
            lisatiedot: undefined,
          },
        ],
        additionalInfo: undefined,
      },
      customerWithContacts: undefined,
      contractorWithContacts: undefined,
      propertyDeveloperWithContacts: undefined,
      representativeWithContacts: undefined,
      invoicingCustomer: undefined,
      creatorName: undefined,
      createdByUserId: undefined,
    } as unknown as KaivuilmoitusFormValues; // cast to satisfy partial object

    render(<AreaSummary formData={formData} />);

    // Total area should render (0 m²) due to fallback polygon. Multiple occurrences (overall, per area, per work area)
    expect(screen.getAllByText(/0 m²/).length).toBeGreaterThanOrEqual(1);
    // Area section title should appear
    expect(screen.getByText(/Testialue/)).toBeInTheDocument();
    // Work area list item ("Työalue 1" or its localized form) should render. We check index-based naming via parentheses
    const listItem = screen.getAllByText(/\(/)[0];
    expect(listItem).toBeInTheDocument();
  });
});

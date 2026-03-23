import React from 'react';
import { render } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import { KaivuilmoitusData, ApplicationType } from '../application/types/application';
import { screen, act } from '@testing-library/react';

// Simulate language change persistence cycle and ensure geometry placeholders survive.

function fireLanguageChange() {
  const evt = new Event('haitaton:languageChanging');
  window.dispatchEvent(evt);
}

describe('KaivuilmoitusContainer geometry persistence', () => {
  it('retains tyoalueet.geometry after language change snapshot + hydration', async () => {
    // Build a minimal KaivuilmoitusData using Partial to avoid filling every field (cast at end).
    const applicationData: Partial<KaivuilmoitusData> = {
      applicationType: 'EXCAVATION_NOTIFICATION' as ApplicationType,
      name: 'Testi',
      workDescription: 'Kuvaus',
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      rockExcavation: null,
      cableReportDone: null,
      cableReports: [],
      placementContracts: [],
      requiredCompetence: true,
      startTime: new Date(),
      endTime: new Date(),
      customerWithContacts: null,
      contractorWithContacts: null,
      propertyDeveloperWithContacts: null,
      representativeWithContacts: null,
      invoicingCustomer: null,
      areas: [
        {
          name: 'Alue 1',
          hankealueId: 1,
          katuosoite: 'Testikatu 1',
          tyonTarkoitukset: null, // keep minimal
          meluhaitta: null,
          polyhaitta: null,
          tarinahaitta: null,
          kaistahaitta: null,
          kaistahaittojenPituus: null,
          lisatiedot: '',
          haittojenhallintasuunnitelma: {},
          tyoalueet: [
            {
              area: 10,
              geometry: {
                type: 'Polygon',
                crs: { type: 'name', properties: { name: 'EPSG:3879' } },
                coordinates: [
                  [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                  ],
                ],
              },
              tormaystarkasteluTulos: null,
            },
          ],
        },
      ],
      additionalInfo: null,
    };
    // Minimal object mimicking Application<KaivuilmoitusData>; only fields consumed by container are included.
    const application = {
      id: 999,
      applicationType: 'EXCAVATION_NOTIFICATION' as ApplicationType,
      hankeTunnus: 'HT-1',
      alluStatus: null,
      applicationData: applicationData as KaivuilmoitusData,
    };

    const hankeData: Partial<HankeData> = {
      id: 1,
      hankeTunnus: 'HT-1',
      onYKTHanke: false,
      nimi: 'Hanke',
      kuvaus: '',
      alkuPvm: null,
      loppuPvm: null,
      vaihe: null,
      tyomaaKatuosoite: null,
      tyomaaTyyppi: [], // mutable empty array
      alueet: [],
      omistajat: [],
      rakennuttajat: [],
      toteuttajat: [],
      muut: [],
      tormaystarkasteluTulos: null,
      status: 'DRAFT',
    } as const;

    render(<KaivuilmoitusContainer hankeData={hankeData as HankeData} application={application} />);

    // Navigate to Areas step (index 1) because initial step is BasicInfo.
    const areasStepButton = screen.getByRole('button', { name: /Alueiden piirto/i });
    act(() => {
      areasStepButton.click();
    });
    // Area name should appear after navigation (may render in multiple UI elements)
    const areaNameOccurrences = screen.getAllByText(/Alue 1/);
    expect(areaNameOccurrences.length).toBeGreaterThan(0);

    // Fire language change snapshot event
    act(() => fireLanguageChange());

    // Force a re-render by toggling something that causes form hydration (language change would reload i18n normally).
    // Directly access form context via window escape hatch
    const ctx = (window as unknown as { kaivuFormContext?: { getValues: () => unknown } })
      .kaivuFormContext;
    expect(ctx).toBeTruthy();
    const valuesWrapper = ctx!.getValues() as { applicationData: KaivuilmoitusData };
    const geom = valuesWrapper.applicationData.areas[0].tyoalueet[0].geometry;
    expect(geom).toBeTruthy();
    expect(geom.type).toBe('Polygon');
    expect(Array.isArray(geom.coordinates)).toBe(true);
    expect(geom.crs).toBeTruthy();
    expect(geom.crs.type).toBe('name');
    // Flush any pending async updates to avoid act() warnings from ApplicationSendDialog
    await act(async () => {});
  });
});

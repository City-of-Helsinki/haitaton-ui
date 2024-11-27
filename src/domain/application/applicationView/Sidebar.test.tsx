import { cloneDeep } from 'lodash';
import { render, screen } from '../../../testUtils/render';
import hankkeet from '../../mocks/data/hankkeet-data';
import hakemukset from '../../mocks/data/hakemukset-data';
import { Application, JohtoselvitysData } from '../types/application';
import { Sidebar } from './Sidebar';
import { HankeData } from '../../types/hanke';

describe('Sidebar', () => {
  describe('Taydennys', () => {
    test('Should show correct taydennys content', async () => {
      const hanke = cloneDeep(hankkeet[1]) as HankeData;
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          areas: [
            ...application.applicationData.areas,
            {
              name: '',
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
            },
          ],
        },
        muutokset: ['areas[1]'],
      };
      const { user } = render(<Sidebar hanke={hanke} application={application} />);

      expect(screen.getByText('Täydennykset')).toBeInTheDocument();
      expect(screen.getByText('Työalue 1 (234 m²)')).toBeInTheDocument();
      expect(screen.getByText('Työalue 2 (30 m²)')).toBeInTheDocument();

      await user.click(screen.getByText('Alkuperäiset'));

      expect(screen.getByText('Työalue (234 m²)')).toBeInTheDocument();
      expect(screen.queryByText('Työalue 2 (30 m²)')).not.toBeInTheDocument();
    });

    test('If there is no taydennys, should not show taydennys tabs', async () => {
      const hanke = cloneDeep(hankkeet[1]) as HankeData;
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      render(<Sidebar hanke={hanke} application={application} />);

      expect(screen.queryByText('Täydennykset')).not.toBeInTheDocument();
      expect(screen.queryByText('Alkuperäiset')).not.toBeInTheDocument();
    });
  });
});

import { cleanup } from '@testing-library/react';
import HankeIndexes from './HankeIndexes';
import { render } from '../../../testUtils/render';
import hankeIndexData from '../../mocks/hankeIndexData';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    const { findByText, getByTestId } = render(<HankeIndexes hankeIndexData={hankeIndexData} />);
    expect(findByText('Liikennehaittaindeksi')).toBeTruthy();
    expect(getByTestId('test-liikennehaittaindeksi')).toHaveTextContent('4');
    expect(findByText('Pyöräilyn pääreitti')).toBeTruthy();
    expect(getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3');
    expect(getByTestId('test-pyoraliikenneindeksi-content')).toHaveTextContent(
      'Kiertoreittitarve: todennäköinen',
    );
    expect(findByText('Merkittävät joukkoliikennereitit')).toBeTruthy();
    expect(getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('1');
    expect(getByTestId('test-raitioliikenneindeksi-content')).toHaveTextContent(
      'Kiertoreittitarve: ei tarvetta',
    );
    expect(getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('2');
    expect(getByTestId('test-linjaautoliikenneindeksi-content')).toHaveTextContent(
      'Kiertoreittitarve: ei tarvetta',
    );
    expect(findByText('Ruuhkautuminen')).toBeTruthy();
    expect(getByTestId('test-autoliikenneindeksi')).toHaveTextContent('4');
    expect(getByTestId('test-autoliikenneindeksi-content')).toHaveTextContent(
      'Kiertoreittitarve: merkittävä',
    );
  });
});

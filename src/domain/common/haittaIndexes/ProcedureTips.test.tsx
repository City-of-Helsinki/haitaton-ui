import { render } from '../../../testUtils/render';
import ProcedureTips from './ProcedureTips';

test.each([
  ['PYORALIIKENNE', 5],
  ['PYORALIIKENNE', 4],
  ['AUTOLIIKENNE', 4],
  ['AUTOLIIKENNE', 3],
  ['LINJAAUTOLIIKENNE', 3],
  ['RAITIOLIIKENNE', 5],
  ['RAITIOLIIKENNE', 4],
  ['MUUT', 0],
])(
  'Should show correct tips for %s and haittaindex %i',
  (haittojenhallintaTyyppi, haittaIndeksi) => {
    const { container } = render(
      <ProcedureTips
        haittojenhallintaTyyppi={haittojenhallintaTyyppi}
        haittaIndex={haittaIndeksi}
      />,
    );
    expect(container).toMatchSnapshot();
  },
);

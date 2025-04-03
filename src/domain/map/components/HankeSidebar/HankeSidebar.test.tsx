import HankeSidebar from './HankeSidebar';
import hankeList from '../../../mocks/hankeList';
import { cleanup, render, screen } from '../../../../testUtils/render';
import { formatToFinnishDate } from '../../../../common/utils/date';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    const hanke = hankeList[0];
    const hankealue = hanke.alueet[0];
    render(
      <HankeSidebar
        hanke={hanke}
        hankealueNimi={hankealue.nimi!}
        isOpen
        handleClose={() => ({})}
      />,
    );
    const hankealueAlkuPvm = formatToFinnishDate(hankealue.haittaAlkuPvm);
    const hankealueLoppuPvm = formatToFinnishDate(hankealue.haittaLoppuPvm);
    const hankeAlkuPvm = formatToFinnishDate(hanke.alkuPvm);
    const hankeLoppuPvm = formatToFinnishDate(hanke.loppuPvm);
    expect(screen.getByText('Mannerheimintie autottomaksi: Hankealue 1')).toBeInTheDocument();
    expect(screen.getByText(`${hankealueAlkuPvm} - ${hankealueLoppuPvm}`)).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintie autottomaksi (HAI22-1)')).toBeInTheDocument();
    expect(screen.getByText(`${hankeAlkuPvm} - ${hankeLoppuPvm}`)).toBeInTheDocument();
    expect(screen.getByText('Yksityishenkilö')).toBeInTheDocument();
    expect(screen.getByText('Ohjelmointi')).toBeInTheDocument();
    expect(screen.getByText('Vesi, Viemäri')).toBeInTheDocument();
    expect(screen.getByText('Hankkeen kuvaus on lyhyt mutta ytimekäs')).toBeInTheDocument();
  });
});

import HankeSidebar from './HankeSidebar';
import hankeList from '../../../mocks/hankeList';
import { cleanup, render, screen } from '../../../../testUtils/render';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    render(
      <HankeSidebar
        hanke={hankeList[0]}
        hankealueNimi={hankeList[0].alueet[0].nimi!}
        isOpen
        handleClose={() => ({})}
      />,
    );
    expect(screen.getByText('Mannerheimintie autottomaksi: Hankealue 1')).toBeInTheDocument();
    expect(screen.getByText('3.10.2022 - 9.10.2022')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintie autottomaksi (HAI22-1)')).toBeInTheDocument();
    expect(screen.getByText('2.10.2022 - 10.10.2022')).toBeInTheDocument();
    expect(screen.getByText('Yksityishenkilö')).toBeInTheDocument();
    expect(screen.getByText('Ohjelmointi')).toBeInTheDocument();
    expect(screen.getByText('Vesi, Viemäri')).toBeInTheDocument();
    expect(screen.getByText('Hankkeen kuvaus on lyhyt mutta ytimekäs')).toBeInTheDocument();
  });
});

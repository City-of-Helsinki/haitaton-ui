import HaitatonFooter from './Footer';
import { render, screen } from '../../../testUtils/render';

describe('HaitatonFooter', () => {
  it('renders all navigation links with correct labels and paths', () => {
    render(<HaitatonFooter />);

    expect(screen.getByRole('link', { name: /käyttöohjeet ja tuki/i })).toHaveAttribute(
      'href',
      '/fi/kaytto-ohjeet',
    );
    expect(screen.getByRole('link', { name: /tietoja haitattomasta/i })).toHaveAttribute(
      'href',
      '/fi/tietoja',
    );
    expect(screen.getByRole('link', { name: /saavutettavuusseloste/i })).toHaveAttribute(
      'href',
      '/fi/saavutettavuusseloste',
    );
    expect(screen.getByRole('link', { name: /tietosuojaselosteet/i })).toHaveAttribute(
      'href',
      '/fi/tietosuojaselosteet',
    );
    expect(screen.getByRole('link', { name: /evästeasetukset/i })).toHaveAttribute(
      'href',
      '/fi/evasteasetukset',
    );
  });
});

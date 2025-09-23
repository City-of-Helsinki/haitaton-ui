import { render } from '@testing-library/react';
import { ExternalScripts } from './ExternalScripts';

describe('ExternalScripts', () => {
  it('renders MatomoScript when enableMatomo is true', () => {
    const { container } = render(<ExternalScripts matomoEnabled={true} />);
    expect(container.querySelector('#matomo')).toBeNull(); // MatomoScript does not render visible elements
  });

  it('does not render anything when enableMatomo is false', () => {
    const { container } = render(<ExternalScripts matomoEnabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('appends and removes the Matomo script to the document body', () => {
    const { unmount } = render(<ExternalScripts matomoEnabled={true} />);
    const script = document.querySelector('script#matomo') as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script?.src).toContain('/scripts/init-matomo.js');
    unmount();
    expect(document.querySelector('script#matomo')).toBeNull();
  });
});

import { render, screen } from '../../../testUtils/render';
import ScrollToTop from './ScrollToTop';

test('Focus should be on the div after route change', () => {
  render(<ScrollToTop />, undefined, '/fi/');

  expect(screen.getByTestId('scroll-to-top-div')).toHaveFocus();
});

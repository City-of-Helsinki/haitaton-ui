import { render } from '@testing-library/react';
import { TrackingWrapper } from './TrackingWrapper';

describe('TrackingWrapper', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    window._paq = [];
  });

  it('renders children when matomo is enabled', () => {
    const { getByText } = render(
      <TrackingWrapper matomoEnabled={true}>
        <div>Child Content</div>
      </TrackingWrapper>,
    );
    expect(getByText('Child Content')).toBeInTheDocument();
    // eslint-disable-next-line no-underscore-dangle
    expect(window._paq).toContainEqual(['trackPageView']);
  });

  it('renders children when matomo is disabled', () => {
    const { getByText } = render(
      <TrackingWrapper matomoEnabled={false}>
        <div>Child Content</div>
      </TrackingWrapper>,
    );
    expect(getByText('Child Content')).toBeInTheDocument();
    // eslint-disable-next-line no-underscore-dangle
    expect(window._paq || []).not.toContainEqual(['trackPageView']);
  });
});

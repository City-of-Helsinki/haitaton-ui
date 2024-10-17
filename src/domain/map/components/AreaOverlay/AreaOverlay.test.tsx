import { render, screen } from '@testing-library/react';
import AreaOverlay from './AreaOverlay';
import { OverlayProps } from '../../../../common/components/map/types';

describe('AreaOverlay', () => {
  const defaultProps: OverlayProps = {
    heading: 'Test Heading',
    subHeading: 'Test Subheading',
    startDate: '2024-01-01T21:59:59.999Z',
    endDate: '2024-12-31T21:59:59.999Z',
    backgroundColor: 'blue',
  };

  test('renders heading and subheading', () => {
    render(<AreaOverlay overlayProps={defaultProps} />);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });

  test('renders formatted dates', () => {
    render(<AreaOverlay overlayProps={defaultProps} />);
    expect(screen.getByText('1.1.2024–31.12.2024')).toBeInTheDocument();
  });

  test('renders copyAreaElement if provided', () => {
    const copyAreaElement = <div>Copy Area Element</div>;
    render(<AreaOverlay overlayProps={defaultProps} copyAreaElement={copyAreaElement} />);
    expect(screen.getByText('Copy Area Element')).toBeInTheDocument();
  });

  test('does not render if overlayProps is not provided', () => {
    const { container } = render(<AreaOverlay />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render if both heading and subHeading are not provided', () => {
    const { container } = render(<AreaOverlay overlayProps={{}} />);
    expect(container.firstChild).toBeNull();
  });

  test('applies background color if provided', () => {
    render(<AreaOverlay overlayProps={defaultProps} />);
    expect(screen.getByText('Test Heading').closest('div')).toHaveStyle('background-color: blue');
  });

  test('applies default background color if background color not provided', () => {
    const propsWithoutBgColor = { ...defaultProps, backgroundColor: undefined };
    render(<AreaOverlay overlayProps={propsWithoutBgColor} />);
    expect(screen.getByText('Test Heading').closest('div')).toHaveStyle(
      'background-color: var(--color-white)',
    );
  });
});

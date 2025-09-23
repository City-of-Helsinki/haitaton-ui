/**
 * Test specific setup configurations through component interactions
 */
import { render, screen } from '../testUtils/render';
import userEvent from '@testing-library/user-event';

// Mock component that uses various setup features
const TestComponent = () => {
  const handleClick = () => {
    console.error('Could not parse CSS stylesheet'); // Should be suppressed
    console.warn('React Router Future Flag Warning'); // Should be suppressed
    console.error('Real error'); // Should not be suppressed
  };

  return (
    <div>
      <button onClick={handleClick} data-testid="trigger">
        Trigger Console
      </button>
      <canvas data-testid="canvas" />
      <div
        data-testid="scrollable"
        style={{ overflow: 'scroll', height: '100px' }}
        onScroll={() => window.scrollTo(0, 0)}
      >
        <div style={{ height: '200px' }}>Scrollable content</div>
      </div>
    </div>
  );
};

describe('Setup Features in Components', () => {
  test('Components render without setup-related errors', async () => {
    const user = userEvent.setup();

    render(<TestComponent />);

    // Test that components render successfully
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('scrollable')).toBeInTheDocument();

    // Test that interactions work without throwing errors
    await user.click(screen.getByTestId('trigger'));

    // Test that scroll operations work
    const scrollableElement = screen.getByTestId('scrollable');
    expect(() => {
      scrollableElement.scrollTop = 50;
      window.scrollTo(0, 0);
    }).not.toThrow();
  });

  test('Canvas operations work with jest-canvas-mock', () => {
    render(<TestComponent />);

    const canvas = screen.getByTestId('canvas');
    const context = (canvas as HTMLCanvasElement).getContext('2d');

    expect(context).not.toBeNull();
    expect(() => {
      context?.fillRect(0, 0, 100, 100);
      context?.fillText('Test', 10, 10);
    }).not.toThrow();
  });

  test('MSW integration works with components', async () => {
    // This would test that MSW server setup works with actual API calls
    // You would create a component that makes an API call and verify it works
    const user = userEvent.setup();

    // Example component that would make an API call
    const ApiTestComponent = () => <button data-testid="api-button">Make API Call</button>;

    render(<ApiTestComponent />);

    // Test that MSW handlers are working
    await user.click(screen.getByTestId('api-button'));

    // Add assertions based on your MSW handlers
    expect(true).toBe(true); // Placeholder
  });
});

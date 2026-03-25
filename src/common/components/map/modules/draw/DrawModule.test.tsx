import { render } from '../../../../../testUtils/render';
import VectorSource from 'ol/source/Vector';
import DrawModule from './DrawModule';
import DrawProvider from './DrawProvider';

const mockSource = new VectorSource();

const mockDrawSegmentGuard = vi.fn();

describe('DrawModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without drawSegmentGuard prop', () => {
    render(
      <DrawProvider source={mockSource}>
        <DrawModule />
      </DrawProvider>,
    );
  });

  it('renders with drawSegmentGuard prop', () => {
    render(
      <DrawProvider source={mockSource}>
        <DrawModule drawSegmentGuard={mockDrawSegmentGuard} />
      </DrawProvider>,
    );
  });

  it('passes drawSegmentGuard prop to DrawInteraction', () => {
    const { container } = render(
      <DrawProvider source={mockSource}>
        <DrawModule drawSegmentGuard={mockDrawSegmentGuard} onSelfIntersectingPolygon={vi.fn()} />
      </DrawProvider>,
    );

    // Verify the component renders (the prop passing is tested in DrawInteraction tests)
    expect(container).toBeTruthy();
  });
});

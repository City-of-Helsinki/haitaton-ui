import { useContext, useEffect, useRef } from 'react';
import { Overlay } from 'ol';
import { Coordinate } from 'ol/coordinate';
import MapContext from '../MapContext';
import { Box } from '@chakra-ui/react';

type Props = {
  position?: Coordinate;
  children: React.ReactNode;
};

export default function MapOverlay({ position, children }: Readonly<Props>) {
  const { map } = useContext(MapContext);
  const overlayElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    const overlay = new Overlay({
      element: overlayElementRef.current || undefined,
      position,
    });

    map.addOverlay(overlay);

    return function cleanup() {
      if (map) {
        map.removeOverlay(overlay);
      }
    };
  }, [map, position]);

  return (
    <Box
      ref={overlayElementRef}
      backgroundColor="var(--color-white)"
      padding="var(--spacing-2-xs)"
      border="1px solid var(--color-black)"
    >
      {children}
    </Box>
  );
}

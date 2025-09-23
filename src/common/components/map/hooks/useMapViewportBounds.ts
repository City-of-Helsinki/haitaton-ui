import { useState, useEffect, useContext } from 'react';
import MapContext from '../MapContext';

export type ViewportBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export function useMapViewportBounds(): ViewportBounds | null {
  const { map } = useContext(MapContext);
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const updateBounds = () => {
      const view = map.getView();
      const mapSize = map.getSize();

      if (!mapSize) {
        return;
      }

      const extent = view.calculateExtent(mapSize);

      if (extent) {
        const [minX, minY, maxX, maxY] = extent;
        setViewportBounds({ minX, maxX, minY, maxY });
      }
    };

    // Set initial bounds
    updateBounds();

    // Listen for view changes
    const handleMoveEnd = () => {
      updateBounds();
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.un('moveend', handleMoveEnd);
    };
  }, [map]);

  return viewportBounds;
}

import { useContext, useEffect } from 'react';
import { Coordinate } from 'ol/coordinate';
import MapContext from '../../../common/components/map/MapContext';

export default function useCenterOnCoordinate(coordinate: Coordinate | undefined) {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (coordinate) {
      map?.getView().animate({ zoom: 9, center: coordinate });
    }
  }, [map, coordinate]);
}

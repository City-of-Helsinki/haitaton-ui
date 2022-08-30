import React, { useContext, useEffect } from 'react';
import { Coordinate } from 'ol/coordinate';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  coordinate: Coordinate | null | undefined;
};

const CenterOnCoordinate: React.FC<Props> = ({ coordinate }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (coordinate) {
      map?.getView().animate({ zoom: 9, center: coordinate });
    }
  }, [map, coordinate]);

  return null;
};

export default CenterOnCoordinate;

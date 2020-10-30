import { useContext, useEffect } from 'react';
import { FullScreen } from 'ol/control';
import MapContext from '../MapContext';

const FullScreenControl = () => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    const fullScreenControl = new FullScreen({});

    map.addControl(fullScreenControl);

    // eslint-disable-next-line
    return () => {
      map.removeControl(fullScreenControl);
    };
  }, [map]);

  return null;
};

export default FullScreenControl;

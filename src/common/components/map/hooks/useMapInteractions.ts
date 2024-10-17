import { useContext } from 'react';
import MapContext from '../MapContext';

export default function useMapInteractions() {
  const { map } = useContext(MapContext);
  return map?.getInteractions();
}

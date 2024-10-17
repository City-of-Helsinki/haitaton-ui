import { Modify } from 'ol/interaction';
import useMapInteractions from './useMapInteractions';

export default function useModifyInteraction() {
  const mapInteractions = useMapInteractions();
  return mapInteractions?.getArray().find((interaction) => interaction instanceof Modify) as
    | Modify
    | undefined;
}

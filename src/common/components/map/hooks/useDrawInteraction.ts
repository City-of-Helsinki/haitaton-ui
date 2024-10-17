import { Draw } from 'ol/interaction';
import useMapInteractions from './useMapInteractions';

export default function useDrawInteraction() {
  const mapInteractions = useMapInteractions();
  return mapInteractions?.getArray().find((interaction) => interaction instanceof Draw) as
    | Draw
    | undefined;
}

import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

export default function useHankeViewPath(hankeTunnus: string): string {
  const getHankeViewPath = useLinkPath(ROUTES.HANKE);
  const hankeViewPath = getHankeViewPath({ hankeTunnus });
  return hankeViewPath;
}

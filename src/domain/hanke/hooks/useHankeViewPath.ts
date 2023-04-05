import useLinkPath from '../../../common/hooks/useLinkPath';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { ROUTES } from '../../../common/types/route';

export default function useHankeViewPath(hankeTunnus: string | null): string {
  const getHankeViewPath = useLinkPath(ROUTES.HANKE);
  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  if (hankeTunnus === null) {
    return HANKEPORTFOLIO.path;
  }

  const hankeViewPath = getHankeViewPath({ hankeTunnus });
  return hankeViewPath;
}

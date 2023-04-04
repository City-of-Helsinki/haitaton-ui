import { useNavigate } from 'react-router-dom';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { ROUTES } from '../../../common/types/route';

/**
 * Returns a function to navigate to hanke view with application list tab initially open.
 * If there is no hankeTunnus, returned function navigates to hanke portfolio as a fallback.
 */
export default function useNavigateToApplicationList(hankeTunnus?: string) {
  const navigate = useNavigate();
  const getHankeViewPath = useLinkPath(ROUTES.HANKE);
  const { HANKEPORTFOLIO } = useLocalizedRoutes();

  const path = hankeTunnus ? getHankeViewPath({ hankeTunnus }) : HANKEPORTFOLIO.path;

  function navigateToApplicationList() {
    navigate(path, { state: { initiallyActiveTab: 4 } });
  }

  return navigateToApplicationList;
}

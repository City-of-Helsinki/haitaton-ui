import { useNavigate } from 'react-router-dom';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

/**
 * Returns a function to navigate to hanke view with application list tab initially open
 */
export default function useNavigateToApplicationList(hankeTunnus: string) {
  const navigate = useNavigate();
  const getHankeViewPath = useLinkPath(ROUTES.HANKE);
  const hankeViewPath = getHankeViewPath({ hankeTunnus });

  function navigateToApplicationList() {
    navigate(hankeViewPath, { state: { initiallyActiveTab: 4 } });
  }

  return navigateToApplicationList;
}

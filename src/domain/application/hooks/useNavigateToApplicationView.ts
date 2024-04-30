import { useNavigate } from 'react-router-dom';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

export default function useNavigateToApplicationView(applicationId?: string) {
  const navigate = useNavigate();
  const getApplicationViewPath = useLinkPath(ROUTES.HAKEMUS);

  function navigateToApplicationView() {
    if (applicationId) {
      navigate(getApplicationViewPath({ id: applicationId }));
    }
  }

  return navigateToApplicationView;
}

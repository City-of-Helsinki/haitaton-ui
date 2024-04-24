import { useLocation, useParams } from 'react-router-dom';
import useHanke from '../../hanke/hooks/useHanke';

/**
 * Get hankeTunnus from URL search params or route params
 * and use it to fetch hanke data
 */
export function useHankeDataInApplication() {
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hankeTunnus = searchParams.get('hanke') ?? params.hankeTunnus;

  const queryResult = useHanke(hankeTunnus);

  if (!hankeTunnus) {
    return null;
  }

  return queryResult;
}

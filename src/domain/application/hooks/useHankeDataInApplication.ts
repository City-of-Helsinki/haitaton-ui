import { useLocation } from 'react-router-dom';
import useHanke from '../../hanke/hooks/useHanke';

/**
 * Get hankeTunnus from URL search params
 * and use it to fetch hanke data
 */
export function useHankeDataInApplication() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hankeTunnus = searchParams.get('hanke');

  const queryResult = useHanke(hankeTunnus);

  if (!hankeTunnus) {
    return null;
  }

  return queryResult;
}

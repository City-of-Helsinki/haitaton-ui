import { Feature } from 'ol';
import { useCallback, useEffect, useState } from 'react';
import { STYLES } from '../utils/geometryStyle';

/**
 * Return function to highlight area
 * and when highlighted area changes,
 * remove highlight from previous area
 */
function useHighlightArea() {
  const [highlightedFeature, setHighlightedFeature] = useState<Feature | undefined>();

  useEffect(() => {
    return () => {
      // Reset previously selected feature style
      // when higlighted feature changes
      highlightedFeature?.setStyle();
    };
  }, [highlightedFeature]);

  const higlightArea = useCallback((feature: Feature | undefined) => {
    setHighlightedFeature(feature);

    feature?.setStyle(STYLES.BLUE_HL);
  }, []);

  return higlightArea;
}

export default useHighlightArea;

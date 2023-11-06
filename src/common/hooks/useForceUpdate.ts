import { useCallback, useState } from 'react';

/**
 * Returns a forceUpdate function that can be used to
 * force a React component to re-render
 */
export default function useForceUpdate() {
  const [, updateState] = useState(0);

  const forceUpdate = useCallback(() => updateState((state) => state + 1), []);

  return forceUpdate;
}

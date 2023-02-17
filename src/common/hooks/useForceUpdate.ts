import { useCallback, useState } from 'react';

export default function useForceUpdate() {
  const [, updateState] = useState(0);

  const forceUpdate = useCallback(() => updateState((state) => state + 1), []);

  return forceUpdate;
}

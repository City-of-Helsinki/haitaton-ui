import { RefObject, useEffect, useRef } from 'react';

export default function useFocusToElement<T extends HTMLElement>(
  dependency: unknown,
): RefObject<T> {
  const firstUpdate = useRef(true);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!firstUpdate.current) {
      ref.current?.focus();
    } else {
      firstUpdate.current = false;
    }
  }, [dependency]);

  return ref;
}

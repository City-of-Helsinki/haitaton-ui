import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll to top of document when URL pathname changes
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.focus();
  }, [pathname]);

  return <div ref={ref} tabIndex={-1} />;
}

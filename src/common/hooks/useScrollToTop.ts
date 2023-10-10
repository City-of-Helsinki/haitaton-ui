import { useEffect } from 'react';

/**
 * Scroll to top of window whenever component
 * using this hook mounts and unmounts.
 * Also return the scrollToTop function.
 */
function useScrollToTop() {
  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    scrollToTop();

    return function cleanup() {
      scrollToTop();
    };
  }, []);

  return scrollToTop;
}

export default useScrollToTop;

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import clsx from 'clsx';

function useDelayedUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isMounted) {
      setShouldRender(true);
    } else {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [isMounted, delayTime]);

  return shouldRender;
}

type Props = {
  showChildren: boolean;
  children: React.ReactNode;
  animateInClass: string;
  animateOutClass: string;
  unmountDelay: number;
};

function Transition({
  showChildren,
  children,
  animateInClass,
  animateOutClass,
  unmountDelay,
}: Readonly<Props>) {
  const shouldRender = useDelayedUnmount(showChildren, unmountDelay);

  return !shouldRender ? null : (
    <Box
      overflow="hidden"
      className={clsx({
        [animateInClass]: showChildren,
        [animateOutClass]: !showChildren,
      })}
    >
      {children}
    </Box>
  );
}

export default Transition;

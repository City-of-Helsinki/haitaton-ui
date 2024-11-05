import React from 'react';
import { Box } from '@chakra-ui/react';
import { OverlayProps } from '../../../../common/components/map/types';
import { formatToFinnishDate } from '../../../../common/utils/date';

type Props = {
  overlayProps?: OverlayProps;
  children?: React.ReactNode;
};

export default function AreaOverlay({ overlayProps, children }: Readonly<Props>) {
  if (!overlayProps) {
    return null;
  }

  const { heading, subHeading, startDate, endDate, backgroundColor } = overlayProps;

  if (!heading && !subHeading) {
    return null;
  }

  return (
    <Box
      border="1px solid var(--color-black)"
      backgroundColor={backgroundColor ?? 'var(--color-white)'}
      padding="var(--spacing-2-xs)"
    >
      {subHeading && <p>{subHeading}</p>}
      {<h4 className="heading-xxs">{heading}</h4>}
      {startDate && endDate && (
        <Box as="p" fontSize="var(--fontsize-body-s)">
          {formatToFinnishDate(startDate)}–{formatToFinnishDate(endDate)}
        </Box>
      )}
      {children && <Box marginTop="var(--spacing-3-xs)">{children}</Box>}
    </Box>
  );
}

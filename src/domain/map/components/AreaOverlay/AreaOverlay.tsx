import { Box } from '@chakra-ui/react';
import { OverlayProps } from '../../../../common/components/map/types';
import { formatToFinnishDate } from '../../../../common/utils/date';

type Props = {
  overlayProps?: OverlayProps;
};

export default function AreaOverlay({ overlayProps }: Props) {
  if (!overlayProps) {
    return null;
  }

  const { heading, subHeading, startDate, endDate, backgroundColor } = overlayProps;

  if (!heading && !subHeading) {
    return null;
  }

  return (
    <Box backgroundColor={backgroundColor} padding="var(--spacing-2-xs)">
      {subHeading && <p>{subHeading}</p>}
      {<h4 className="heading-xxs">{heading}</h4>}
      {startDate && endDate && (
        <Box as="p" fontSize="var(--fontsize-body-s)">
          {formatToFinnishDate(startDate)}–{formatToFinnishDate(endDate)}
        </Box>
      )}
    </Box>
  );
}

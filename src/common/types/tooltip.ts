import { Placement } from '@popperjs/core';

export type TooltipProps = React.PropsWithChildren<{
  tooltipButtonLabel?: string;
  /* Tooltip content text */
  tooltipText?: string;
  /**
   * The placement of the tooltip.
   */
  placement?: Placement;
  /**
   * Use the small tooltip variant.
   */
  small?: boolean;
  /**
   * Aria-label text for the tooltip trigger button.
   */
  buttonLabel?: string;
  /**
   * Aria-label text for the tooltip.
   */
  tooltipLabel?: string;
  /**
   * Additional wrapper class names.
   */
  className?: string;
  /**
   * Additional button class names.
   */
  buttonClassName?: string;
  /**
   * Additional tooltip class names.
   */
  tooltipClassName?: string;
}>;

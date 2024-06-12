import { Tooltip } from 'hds-react';
import styles from './HaittaIndexTooltip.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function HaittaIndexTooltip({ children }: Readonly<Props>) {
  return <Tooltip buttonClassName={styles.tooltipButton}>{children}</Tooltip>;
}

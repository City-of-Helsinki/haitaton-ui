import { IconAlertCircle, IconCheckCircle, Tag } from 'hds-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import styles from './HankeStatusTag.module.scss';
import { HANKE_STATUS_KEY } from '../../types/hanke';

function HankeStatusTag({ status }: Readonly<{ status: HANKE_STATUS_KEY | null }>) {
  const { t } = useTranslation();

  if (status === 'PUBLIC') {
    // Public status is not shown as a tag
    return null;
  }

  const statusText = t(`hanke:status:${status}`);

  let icon = null;
  if (status === null || status === 'DRAFT') {
    icon = <IconAlertCircle style={{ marginRight: 'var(--spacing-2-xs)' }} />;
  }
  if (status === 'COMPLETED') {
    icon = <IconCheckCircle style={{ marginRight: 'var(--spacing-2-xs)' }} />;
  }

  /*
   * Determine background color for status tag.
   * Grey (default) background if there is no status or the status is DRAFT,
   * green background with white text if status is completed hanke.
   */
  const bgGreen = status === 'COMPLETED';

  return (
    <Tag
      theme={{
        '--background-color': 'var(--color-black-10)',
      }}
      className={clsx({
        [styles.bgGreen]: bgGreen,
      })}
      iconStart={icon}
      data-testid="hanke-status-tag"
      placeholder={statusText}
    >
      {statusText}
    </Tag>
  );
}

export default HankeStatusTag;

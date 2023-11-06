import React from 'react';
import { IconAlertCircle, Tag } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { AlluStatusStrings, AlluStatus } from '../types/application';
import styles from './ApplicationStatusTag.module.scss';

/**
 * Get theme for status tag.
 * Grey background if there is no Allu status (meaning it's draft)
 * or status is replaced (korvattu),
 * green background with white text if status is decision (päätös)
 * and yellow backround otherwise.
 */
function getTheme(status: AlluStatusStrings | null) {
  if (status === null || status === AlluStatus.REPLACED) {
    return undefined;
  }

  if (status === AlluStatus.DECISION) {
    return { '--tag-background': 'var(--color-success)', '--tag-color': 'var(--color-white)' };
  }

  return { '--tag-background': 'var(--color-alert)' };
}

function ApplicationStatusTag({ status }: { status: AlluStatusStrings | null }) {
  const { t } = useTranslation();

  const statusText = t(`hakemus:status:${status}`);
  // If application is in draft state or waiting information (täydennyspyyntö),
  // display alert icon before status text
  const icon =
    status === null || status === AlluStatus.WAITING_INFORMATION ? (
      <IconAlertCircle style={{ marginRight: 'var(--spacing-2-xs)' }} />
    ) : null;

  return (
    <Tag theme={getTheme(status)} data-testid="application-status-tag">
      <div className={styles.applicationStatusTag}>
        {icon} {statusText}
      </div>
    </Tag>
  );
}

export default ApplicationStatusTag;

import { IconAlertCircle, IconCheckCircle, IconError, Tag } from 'hds-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { AlluStatusStrings, AlluStatus } from '../types/application';
import styles from './ApplicationStatusTag.module.scss';

function ApplicationStatusTag({ status }: Readonly<{ status: AlluStatusStrings | null }>) {
  const { t } = useTranslation();

  const statusText = t(`hakemus:status:${status}`);

  // If application is in draft state or waiting information (täydennyspyyntö)
  // or finished (valmis) display icon before status text
  let icon = null;
  if (status === null) {
    icon = <IconAlertCircle />;
  }
  if (status === AlluStatus.WAITING_INFORMATION) {
    icon = <IconError />;
  }
  if (status === AlluStatus.FINISHED) {
    icon = <IconCheckCircle />;
  }

  /*
   * Determine background color for status tag.
   * Grey (default) background if there is no Allu status (meaning it's draft)
   * or status is replaced (korvattu) or cancelled (peruttu) or archived (arkistoitu),
   * green background with white text if status is decision (päätös) or finished (työ valmis)
   * or operational condition (toiminnallinen kunto),
   * red background with white text if status is waiting information (täydennyspyyntö),
   * and yellow background otherwise.
   */
  const bgDefault =
    status === null ||
    status === AlluStatus.REPLACED ||
    status === AlluStatus.CANCELLED ||
    status === AlluStatus.ARCHIVED;
  const bgGreen =
    status === AlluStatus.DECISION ||
    status === AlluStatus.FINISHED ||
    status === AlluStatus.OPERATIONAL_CONDITION;
  const bgRed = status === AlluStatus.WAITING_INFORMATION;
  const bgYellow = !bgDefault && !bgGreen && !bgRed;

  return (
    <Tag
      theme={{
        '--background-color': 'var(--color-black-10)',
      }}
      className={clsx({
        [styles.bgYellow]: bgYellow,
        [styles.bgGreen]: bgGreen,
        [styles.bgRed]: bgRed,
      })}
      data-testid="application-status-tag"
      iconStart={icon}
      placeholder={t('hakemus:labels:applicationState')}
    >
      {statusText}
    </Tag>
  );
}

export default ApplicationStatusTag;

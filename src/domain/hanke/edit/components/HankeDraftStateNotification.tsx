import { Notification } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HankeData } from '../../../types/hanke';
import { useIsHankeValid } from '../hooks/useIsHankeValid';

type Props = {
  /** Hanke data */
  hanke: HankeData;
  /** Additional class names to apply to the notification */
  className?: string;
};

/**
 * Show hanke draft state notification if there are missing required fields in hanke
 */
const HankeDraftStateNotification: React.FC<Props> = ({ hanke, className }) => {
  const { t } = useTranslation();

  // Check if hanke has all the required fields filled
  const isHankeValid = useIsHankeValid(hanke);

  if (isHankeValid) {
    return null;
  }

  return (
    <Notification
      size="small"
      label={t('hankePortfolio:draftStateLabel')}
      className={className}
      type="alert"
    >
      {t('hankePortfolio:draftState')}
    </Notification>
  );
};

export default HankeDraftStateNotification;

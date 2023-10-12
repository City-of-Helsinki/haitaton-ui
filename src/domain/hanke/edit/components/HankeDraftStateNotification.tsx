import { Notification } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HankeData } from '../../../types/hanke';

type Props = {
  /** Hanke data */
  hanke: HankeData;
  /** Additional class names to apply to the notification */
  className?: string;
};

/**
 * Show hanke draft state notification if it's status is DRAFT
 */
const HankeDraftStateNotification: React.FC<Props> = ({ hanke, className }) => {
  const { t } = useTranslation();

  if (hanke.status === 'DRAFT') {
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
  }

  return null;
};

export default HankeDraftStateNotification;

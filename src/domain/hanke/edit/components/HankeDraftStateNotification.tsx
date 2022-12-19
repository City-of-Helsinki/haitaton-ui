import { Notification } from 'hds-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HankeData } from '../../../types/hanke';
import { hankeSchema } from '../hankeSchema';

/**
 * Check that hanke data is valid against hanke yup schema
 */
function useIsHankeValid(hanke: HankeData) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    hankeSchema.isValid(hanke).then((valid) => {
      setIsValid(valid);
    });
  }, [hanke]);

  return isValid;
}

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

import { useTranslation } from 'react-i18next';
import { Notification } from 'hds-react';

type Props = {
  generated?: boolean;
  className?: string;
};

const HankeGeneratedStateNotification: React.FC<Props> = ({ generated, className }) => {
  const { t } = useTranslation();

  if (!generated) {
    return null;
  }

  return (
    <Notification
      size="small"
      className={className}
      label={t('hankePortfolio:generatedStateLabel')}
    >
      {t('hankePortfolio:generatedState')}
    </Notification>
  );
};

export default HankeGeneratedStateNotification;

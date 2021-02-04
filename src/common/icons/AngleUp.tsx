import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAngleUp } from 'hds-react/icons';

const IconAngleUpIcon: React.FC = () => {
  const { t } = useTranslation();
  return <IconAngleUp aria-label={t('common:icons:arrowUp')} />;
};
export default IconAngleUpIcon;

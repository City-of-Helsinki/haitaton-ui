import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAngleDown } from 'hds-react/icons';

const IconAngleDownIcon: React.FC = () => {
  const { t } = useTranslation();
  return <IconAngleDown aria-label={t('common:icons:arrowDown')} />;
};
export default IconAngleDownIcon;

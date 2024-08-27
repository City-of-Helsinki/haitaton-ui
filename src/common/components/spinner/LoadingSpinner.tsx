import React from 'react';
import { LoadingSpinner as HDSLoadingSpinner, LoadingSpinnerProps } from 'hds-react';

import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loadingText,
  loadingFinishedText,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <HDSLoadingSpinner
      loadingText={loadingText ? loadingText : t('common:components:loadingSpinner:loadingText')}
      loadingFinishedText={
        loadingFinishedText
          ? loadingFinishedText
          : t('common:components:loadingSpinner:loadingFinishedText')
      }
      {...rest}
    />
  );
};

export default LoadingSpinner;

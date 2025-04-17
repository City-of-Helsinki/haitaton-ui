import React from 'react';
import { ButtonVariant, IconArrowLeft, IconArrowRight } from 'hds-react';
import { useTranslation } from 'react-i18next';
import styles from './FormActions.module.scss';
import Button from '../../../common/components/button/Button';

interface Props {
  activeStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  previousButtonIsLoading?: boolean;
  previousButtonLoadingText?: string;
  nextButtonIsLoading?: boolean;
  nextButtonLoadingText?: string;
}

const FormActions: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  activeStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  previousButtonIsLoading,
  previousButtonLoadingText,
  nextButtonIsLoading,
  nextButtonLoadingText,
}) => {
  const { t } = useTranslation();
  const firstStep = activeStepIndex === 0;
  const lastStep = activeStepIndex === totalSteps - 1;

  return (
    <div className={styles.actions}>
      {!firstStep && (
        <Button
          iconStart={<IconArrowLeft />}
          variant={ButtonVariant.Secondary}
          onClick={onPrevious}
          isLoading={previousButtonIsLoading}
          loadingText={previousButtonLoadingText}
        >
          {t('hankeForm:previousButton')}
        </Button>
      )}
      {children}
      {!lastStep && (
        <Button
          iconStart={<IconArrowRight />}
          variant={ButtonVariant.Secondary}
          onClick={onNext}
          isLoading={nextButtonIsLoading}
          loadingText={nextButtonLoadingText}
        >
          {t('hankeForm:nextButton')}
        </Button>
      )}
    </div>
  );
};

export default FormActions;

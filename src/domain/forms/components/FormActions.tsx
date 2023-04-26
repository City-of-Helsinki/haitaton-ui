import React from 'react';
import { Button, IconArrowLeft, IconArrowRight } from 'hds-react';
import { useTranslation } from 'react-i18next';
import styles from './FormActions.module.scss';

interface Props {
  activeStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  nextButtonIsLoading?: boolean;
  nextButtonLoadingText?: string;
}

const FormActions: React.FC<Props> = ({
  children,
  activeStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  nextButtonIsLoading,
  nextButtonLoadingText,
}) => {
  const { t } = useTranslation();
  const firstStep = activeStepIndex === 0;
  const lastStep = activeStepIndex === totalSteps - 1;

  return (
    <div className={styles.actions}>
      {!firstStep && (
        <Button iconLeft={<IconArrowLeft />} variant="secondary" onClick={onPrevious}>
          {t('hankeForm:previousButton')}
        </Button>
      )}
      {children}
      {!lastStep && (
        <Button
          iconRight={<IconArrowRight />}
          variant="secondary"
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

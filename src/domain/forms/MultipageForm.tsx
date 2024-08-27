import React, { useReducer } from 'react';
import { Notification, Stepper, StepState } from 'hds-react';
import { Box, Flex } from '@chakra-ui/react';
import { AnyObject, ObjectSchema } from 'yup';
import styles from './MultipageForm.module.scss';
import useLocale from '../../common/hooks/useLocale';
import Text from '../../common/components/text/Text';
import { createStepReducer } from './formStepReducer';
import { Action, ACTION_TYPE, StepperStep } from './types';
import MainHeading from '../../common/components/mainHeading/MainHeading';
import LoadingSpinner from '../../common/components/spinner/LoadingSpinner';

function LoadingIndicator({ loadingText }: { loadingText?: string }) {
  return (
    <Flex justifyContent="center" alignItems="center" height="130px">
      <Box mr="var(--spacing-m)">
        <LoadingSpinner small data-testid="multipage-form-loading-spinner" />
      </Box>
      {loadingText ? (
        <Text tag="p" weight="bold">
          {loadingText}
        </Text>
      ) : null}
    </Flex>
  );
}

interface FormStep extends StepperStep {
  element: React.ReactNode;
  label: string;
  state: StepState;
  validationSchema?: ObjectSchema<AnyObject>;
}

interface Props {
  /**
   * Optional children function that is called
   * with index of the active step and handler
   * functions for previous and next steps
   */
  children?: (
    activeStepIndex: number,
    handlePrevious: () => void,
    handleNext: () => void,
  ) => React.ReactNode;
  /** Heading of the form */
  heading: string;
  subHeading?: string | JSX.Element;
  /** Array of form steps to render */
  formSteps: FormStep[];
  isLoading?: boolean;
  isLoadingText?: string;
  /** Function that is called when step is changed */
  onStepChange?: (stepIndex: number) => void;
  onSubmit?: () => void;
  /**
   * Function that is called with a function that changes step and current step index,
   * and should validate the step and execute the given function if step is valid.
   */
  stepChangeValidator?: (changeStep: () => void, stepIndex: number) => void;
  notificationLabel?: string;
  notificationText?: string;
  formErrorsNotification?: React.ReactNode;
  formData?: unknown;
}

/**
 * Reusable component for creating multi-page forms.
 * Renders stepper for navigating the form.
 */
const MultipageForm: React.FC<Props> = ({
  children,
  heading,
  subHeading,
  formSteps,
  isLoading = false,
  isLoadingText,
  onStepChange,
  onSubmit,
  stepChangeValidator,
  notificationLabel,
  notificationText,
  formErrorsNotification,
  formData,
}) => {
  const locale = useLocale();

  const stepReducer = createStepReducer(formSteps.length);
  const initialState = {
    activeStepIndex: 0,
    steps: formSteps,
  };
  const [state, dispatch] = useReducer(stepReducer, initialState);

  function handleStepChange(value: Action) {
    function changeStep() {
      window.scrollTo(0, 0);
      dispatch(value);
      if (onStepChange) {
        onStepChange(
          value.type === ACTION_TYPE.COMPLETE_STEP
            ? value.payload.stepIndex + 1
            : value.payload.stepIndex,
        );
      }
    }

    if (stepChangeValidator) {
      stepChangeValidator(changeStep, state.activeStepIndex);
    } else {
      changeStep();
    }
  }

  function handleStepClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    stepIndex: number,
  ) {
    handleStepChange({ type: ACTION_TYPE.SET_ACTIVE, payload: { stepIndex, formData } });
  }

  function handlePrevious() {
    handleStepChange({
      type: ACTION_TYPE.SET_ACTIVE,
      payload: { stepIndex: state.activeStepIndex - 1, formData },
    });
  }

  function handleNext() {
    handleStepChange({
      type: ACTION_TYPE.COMPLETE_STEP,
      payload: { stepIndex: state.activeStepIndex, formData },
    });
  }

  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      {subHeading && (
        <Text tag="h2" styleAs="h4" spacingBottom="s">
          {subHeading}
        </Text>
      )}

      <MainHeading>{heading}</MainHeading>

      {notificationLabel && notificationText && (
        <Notification dataTestId="form-notification" size="large" label={notificationLabel}>
          {notificationText}
        </Notification>
      )}

      {formErrorsNotification}

      <div className={styles.stepper}>
        {isLoading ? (
          <LoadingIndicator loadingText={isLoadingText} />
        ) : (
          <Stepper
            steps={state.steps}
            language={locale}
            selectedStep={state.activeStepIndex}
            onStepClick={handleStepClick}
            stepHeading
          />
        )}
      </div>

      {formSteps[state.activeStepIndex].element}

      {children && children(state.activeStepIndex, handlePrevious, handleNext)}
    </form>
  );
};

export default MultipageForm;

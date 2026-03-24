import React, { useReducer } from 'react';
import { flushSync } from 'react-dom';
import { Stepper, StepState } from 'hds-react';
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
  /** Additional element to show below form heading */
  topElement?: React.ReactNode;
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
  formData?: unknown;
  validationContext?: AnyObject;
  /** Optional initial step index (useful for tests) */
  initialStep?: number;
  /** Optional persistence key to save/restore active step across language changes */
  stepPersistKey?: string;
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
  topElement,
  formData,
  validationContext,
  initialStep,
  stepPersistKey,
}) => {
  const locale = useLocale();

  const stepReducer = createStepReducer(formSteps.length);

  // Determine initial active step: precedence
  //  1. explicit initialStep prop
  //  2. persisted step from sessionStorage keyed by stepPersistKey
  //  3. default 0
  let persistedStep: number | undefined;
  try {
    if (stepPersistKey && typeof globalThis.window !== 'undefined') {
      const raw = sessionStorage.getItem(`${stepPersistKey}-activeStep`);
      if (raw !== null) {
        const parsed = Number.parseInt(raw, 10);
        if (!Number.isNaN(parsed))
          persistedStep = Math.max(0, Math.min(parsed, formSteps.length - 1));
      }
    }
  } catch {
    // ignore sessionStorage errors
  }

  const initialState = {
    activeStepIndex:
      typeof initialStep === 'number'
        ? Math.max(0, Math.min(initialStep, formSteps.length - 1))
        : persistedStep ?? 0,
    steps: formSteps,
  };

  const [state, dispatch] = useReducer(stepReducer, initialState);

  function handleStepChange(value: Action) {
    function changeStep() {
      window.scrollTo(0, 0);
      // Ensure step state update flushes synchronously so tests that query immediately after
      // navigation (using queryByText instead of findByText/waitFor) see the updated heading.
      flushSync(() => {
        dispatch(value);
        if (onStepChange) {
          onStepChange(
            value.type === ACTION_TYPE.COMPLETE_STEP
              ? value.payload.stepIndex + 1
              : value.payload.stepIndex,
          );
        }
      });
    }

    if (stepChangeValidator) {
      stepChangeValidator(changeStep, state.activeStepIndex);
    } else {
      changeStep();
    }
  }

  // Persist active step index when language change is about to occur so it can be
  // restored after navigation. This mirrors the form value persistence hook which
  // listens for the same `haitaton:languageChanging` event.
  React.useEffect(() => {
    if (!stepPersistKey) return;
    const handler = () => {
      try {
        sessionStorage.setItem(`${stepPersistKey}-activeStep`, String(state.activeStepIndex));
      } catch {
        // ignore
      }
    };
    globalThis.window.addEventListener('haitaton:languageChanging', handler);
    return () => globalThis.window.removeEventListener('haitaton:languageChanging', handler);
    // Intentionally include state.activeStepIndex so the latest value is persisted
    // when the event fires.
  }, [stepPersistKey, state.activeStepIndex]);

  function handleStepClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    stepIndex: number,
  ) {
    handleStepChange({
      type: ACTION_TYPE.SET_ACTIVE,
      payload: { stepIndex, formData, validationContext },
    });
  }

  function handlePrevious() {
    handleStepChange({
      type: ACTION_TYPE.SET_ACTIVE,
      payload: { stepIndex: state.activeStepIndex - 1, formData, validationContext },
    });
  }

  function handleNext() {
    handleStepChange({
      type: ACTION_TYPE.COMPLETE_STEP,
      payload: { stepIndex: state.activeStepIndex, formData, validationContext },
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

      {topElement}

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

      {children?.(state.activeStepIndex, handlePrevious, handleNext)}
    </form>
  );
};

export default MultipageForm;

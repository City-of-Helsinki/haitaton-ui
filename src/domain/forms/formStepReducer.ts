import { StepState } from 'hds-react';
import { Action, State } from './types';

export function createStepReducer(totalSteps: number) {
  return function stepReducer(state: State, action: Action): State {
    switch (action.type) {
      case 'completeStep': {
        const activeStepIndex =
          action.payload.stepIndex === totalSteps - 1
            ? totalSteps - 1
            : action.payload.stepIndex + 1;
        return {
          activeStepIndex,
          steps: state.steps.map((step, index) => {
            if (index === action.payload.stepIndex && index !== totalSteps - 1) {
              // current step but not last one
              return {
                ...step,
                state:
                  !step.validationSchema ||
                  step.validationSchema.isValidSync(action.payload.formData)
                    ? StepState.completed
                    : StepState.attention,
                label: step.label,
              };
            }
            if (index === action.payload.stepIndex + 1) {
              // next step
              return {
                ...step,
                state:
                  !step.validationSchema ||
                  step.validationSchema.isValidSync(action.payload.formData)
                    ? StepState.available
                    : StepState.attention,
                label: step.label,
              };
            }
            return step;
          }),
        };
      }
      case 'setActive': {
        return {
          activeStepIndex: action.payload.stepIndex,
          steps: state.steps.map((step, index) => {
            if (index === action.payload.stepIndex) {
              return {
                ...step,
                state: StepState.available,
                label: step.label,
              };
            }
            if (index === state.activeStepIndex) {
              return {
                ...step,
                state: !step.validationSchema
                  ? StepState.available
                  : step.validationSchema.isValidSync(action.payload.formData)
                    ? StepState.completed
                    : StepState.attention,
                label: step.label,
              };
            }
            return step;
          }),
        };
      }
      default:
        throw new Error();
    }
  };
}

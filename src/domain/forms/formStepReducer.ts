import { StepState } from 'hds-react';
import { Action, State } from './types';

export function createStepReducer(totalSteps: number) {
  return function stepReducer(state: State, action: Action): State {
    switch (action.type) {
      case 'completeStep': {
        const activeStepIndex =
          action.payload === totalSteps - 1 ? totalSteps - 1 : action.payload + 1;
        return {
          activeStepIndex,
          steps: state.steps.map((step, index) => {
            if (index === action.payload && index !== totalSteps - 1) {
              // current step but not last one
              return {
                state: StepState.completed,
                label: step.label,
              };
            }
            if (index === action.payload + 1) {
              // next step
              return {
                state: StepState.available,
                label: step.label,
              };
            }
            return step;
          }),
        };
      }
      case 'setActive': {
        return {
          activeStepIndex: action.payload,
          steps: state.steps.map((step, index) => {
            if (index === action.payload) {
              return {
                state: StepState.available,
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

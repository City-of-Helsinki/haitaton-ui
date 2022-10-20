import { StepState } from 'hds-react';

export enum ACTION_TYPE {
  COMPLETE_STEP = 'completeStep',
  SET_ACTIVE = 'setActive',
}

export interface StepperStep {
  label: string;
  state: StepState;
}

export interface State {
  activeStepIndex: number;
  steps: StepperStep[];
}

export interface Action {
  type: ACTION_TYPE;
  payload: number;
}

import { StepState } from 'hds-react';
import { AnyObject, ObjectSchema } from 'yup';

export enum ACTION_TYPE {
  COMPLETE_STEP = 'completeStep',
  SET_ACTIVE = 'setActive',
}

export interface StepperStep {
  label: string;
  state: StepState;
  validationSchema?: ObjectSchema<AnyObject>;
  /** Context object for validation */
  context?: AnyObject;
}

export interface State {
  activeStepIndex: number;
  steps: StepperStep[];
}

export interface Action {
  type: ACTION_TYPE;
  payload: { stepIndex: number; formData?: unknown };
}

export enum FORM_PAGES {
  PERUSTIEDOT = 'perustiedot',
  ALUEET = 'alueet',
  HAITTOJEN_HALLINTA = 'haittojenHallinta',
  YHTEYSTIEDOT = 'yhteystiedot',
  LIITTEET = 'liitteet',
}

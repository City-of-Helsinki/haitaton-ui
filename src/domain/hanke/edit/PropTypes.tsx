import { Dispatch, SetStateAction } from 'react';

export default interface PropTypes {
  changeWizardView: Dispatch<SetStateAction<number>>;
  // eslint-disable-next-line
  errors?: any;
  // eslint-disable-next-line
  control?: any;
}

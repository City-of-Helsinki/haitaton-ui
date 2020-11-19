// eslint-disable-next-line
import { FieldErrors, Control } from 'react-hook-form/dist/types';

export default interface PropTypes {
  errors: FieldErrors;
  control: Control;
  // eslint-disable-next-line
  register: any;
}

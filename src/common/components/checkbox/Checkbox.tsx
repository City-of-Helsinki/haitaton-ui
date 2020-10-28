import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Checkbox } from 'hds-react';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  // eslint-disable-next-line
  rules?: any;
  defaultValue?: string;
  label: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  checked?: boolean;
  // eslint-disable-next-line
  onChange?: any;
};
const CheckboxComp: React.FC<PropTypes> = (props) => {
  const {
    name,
    id,
    control,
    rules,
    defaultValue,
    label,
    invalid,
    errorMsg,
    disabled,
    checked,
    onChange,
  } = props;
  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={() => (
          <Checkbox
            id={id}
            label={label}
            name={name}
            onChange={onChange}
            checked={checked}
            disabled={disabled}
          />
        )}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </>
  );
};
export default CheckboxComp;

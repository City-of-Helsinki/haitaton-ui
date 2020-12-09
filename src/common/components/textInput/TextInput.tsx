import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'hds-react';

import { TooltipProps } from '../../types/tooltip';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string;
  label: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  tooltip?: TooltipProps;
};
const TextInputComp: React.FC<PropTypes> = (props) => {
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
    tooltip,
  } = props;
  const role = 'text';
  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            id={id}
            label={label}
            invalid={invalid}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled}
            value={value}
            {...tooltip}
            data-testid={id}
            role={role}
          />
        )}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </>
  );
};
export default TextInputComp;

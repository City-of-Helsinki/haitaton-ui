import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextInput as HdsTextInput } from 'hds-react';
import { TooltipProps } from 'hds-react/components/Tooltip';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  label: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  tooltip?: TooltipProps;
};

const TextInput: React.FC<PropTypes> = ({
  id,
  name,
  control,
  label,
  invalid,
  errorMsg,
  disabled,
  tooltip,
}) => (
  <Controller
    id={id}
    name={name}
    control={control}
    render={({ onChange, onBlur, value }) => (
      <HdsTextInput
        id={id}
        label={label}
        helperText={invalid ? errorMsg : undefined}
        invalid={invalid}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        disabled={disabled}
        value={value}
        data-testid={id}
        {...tooltip}
      />
    )}
  />
);

export default TextInput;

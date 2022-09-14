import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from 'hds-react';

type PropTypes = {
  name: string;
  id: string;
  rules?: Record<string, unknown>;
  defaultValue?: string;
  label: string;
  disabled?: boolean;
};
const CheckboxComp: React.FC<PropTypes> = (props) => {
  const { name, id, rules, defaultValue, label, disabled } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Checkbox
          id={id}
          label={label}
          {...field}
          checked={field.value}
          disabled={disabled}
          data-testid={name}
        />
      )}
    />
  );
};
export default CheckboxComp;

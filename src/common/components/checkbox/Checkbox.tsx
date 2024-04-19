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
  className?: string;
};
const CheckboxComp: React.FC<React.PropsWithChildren<PropTypes>> = (props) => {
  const { name, id, rules, defaultValue, label, disabled, className } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Checkbox
          className={className}
          id={id}
          label={label}
          {...field}
          value={field.value ? 'true' : 'false'}
          checked={field.value ?? false}
          disabled={disabled}
          data-testid={name}
        />
      )}
    />
  );
};
export default CheckboxComp;

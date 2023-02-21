import React from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { RadioButton as HDSRadioButton } from 'hds-react';

type Props<T extends FieldValues> = {
  name: FieldPath<T>;
  id: string;
  label: string;
  value: boolean;
};

/**
 * Radio button variant that accepts boolean value
 * and also updates boolean value to form state.
 */
const BooleanRadioButton = <T extends FieldValues>({ name, id, label, value }: Props<T>) => {
  const {
    field: { onChange, onBlur, value: inputValue },
  } = useController({ name });

  return (
    <HDSRadioButton
      id={id}
      label={label}
      onChange={(event) => {
        const booleanValue: boolean = event.target.value === 'true';
        onChange(booleanValue);
      }}
      onBlur={onBlur}
      value={value.toString()}
      checked={value === inputValue}
    />
  );
};

export default BooleanRadioButton;

import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { RadioButton as HDSRadioButton, RadioButtonProps } from 'hds-react';

interface Props<T extends FieldValues> extends Omit<RadioButtonProps, 'value'> {
  name: FieldPath<T>;
  id: string;
  label: string;
  value: boolean;
}

/**
 * Radio button variant that accepts boolean value
 * and also updates boolean value to form state.
 */
const BooleanRadioButton = <T extends FieldValues>({
  name,
  id,
  label,
  value,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, onBlur, value: inputValue, ref },
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
      data-testid={id}
      ref={ref}
      {...rest}
    />
  );
};

export default BooleanRadioButton;

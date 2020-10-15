import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'hds-react';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  // eslint-disable-next-line
  rules?: any;
  defaultValue: string;
  label: string;
  invalid?: boolean;
  errorMsg?: string;
};
const TextInputComp: React.FC<PropTypes> = (props) => {
  const { name, id, control, rules, defaultValue, label, invalid, errorMsg } = props;
  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ onChange, onBlur }) => (
          <TextInput
            id={id}
            label={label}
            invalid={invalid}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </>
  );
};
export default TextInputComp;

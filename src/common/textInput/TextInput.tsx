import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput } from 'hds-react';

type PropTypes = {
  name: string;
  id: string;
  control: any;
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
        render={({ onChange, onBlur, name }) => (
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

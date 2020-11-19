import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Dropdown as HdsDropdown } from 'hds-react';

type Option = { value: string; label: string };

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue?: string;
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
};

const Dropdown: React.FC<PropTypes> = (props) => {
  const { name, id, control, rules, options, defaultValue, label, invalid, errorMsg } = props;

  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, value }) => (
          <HdsDropdown
            options={options}
            defaultValue={defaultValue ? options.find((o) => o.value === defaultValue) : undefined}
            selectedOption={options.find((o) => o.value === value)}
            label={label}
            invalid={invalid}
            // eslint-disable-next-line
            onChange={(option: any) => onChange(option.value)}
          />
        )}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </>
  );
};
export default Dropdown;

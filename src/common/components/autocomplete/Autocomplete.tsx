import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Combobox, Tooltip, TooltipProps } from 'hds-react';

type Option = { value: string | number; label: string };

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string;
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
};

const Autocomplete: React.FC<PropTypes> = ({
  name,
  id,
  control,
  rules,
  options,
  defaultValue,
  label,
  invalid,
  errorMsg,
  tooltip,
}) => {
  return (
    <div className="autocomplete">
      {!!tooltip && <Tooltip {...tooltip} />}
      <Controller
        name={name}
        id={id}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, value }) => {
          return (
            <Combobox
              label={label}
              // helper="Assistive text"
              placeholder="Placeholder"
              // toggleButtonAriaLabel="Toggle menu"
              options={options}
              defaultValue={
                defaultValue ? options.find((o) => o.value === defaultValue) : undefined
              }
              value={options.find((o) => o.value === value)}
              // eslint-disable-next-line
              onChange={(option: any) => onChange(option.value)}
            />
          );
        }}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </div>
  );
};

export default Autocomplete;

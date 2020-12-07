import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Dropdown as HdsDropdown, Tooltip } from 'hds-react';
import { TooltipProps } from 'hds-react/components/Tooltip';

import './dropDown.styles.scss';

type Option = { value: string; label: string };

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string | null;
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
  disabled?: boolean;
};

const Dropdown: React.FC<PropTypes> = ({
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
  disabled,
}) => {
  return (
    <div className="dropdownComp">
      {!!tooltip && <Tooltip {...tooltip} />}

      <Controller
        name={name}
        id={id}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, value }) => {
          return (
            <HdsDropdown
              options={options}
              defaultValue={
                defaultValue ? options.find((o) => o.value === defaultValue) : undefined
              }
              id={id}
              selectedOption={options.find((o) => o.value === value)}
              label={label}
              invalid={invalid}
              // eslint-disable-next-line
              onChange={(option: any) => onChange(option.value)}
              disabled={disabled}
            />
          );
        }}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </div>
  );
};

export default Dropdown;

import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Dropdown as HdsDropdown, Tooltip } from 'hds-react';

import { TooltipProps } from '../../types/tooltip';

import './dropDown.styles.scss';

type Option = { value: string; label: string };

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string[];
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
};

const Dropdown: React.FC<PropTypes> = ({
  name,
  id,
  control,
  rules,
  options,
  defaultValue = [],
  label,
  invalid,
  errorMsg,
  tooltip,
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
              defaultValues={options.filter((o) => value.includes(o.value))}
              selectedOption={options.filter((o) => value.includes(o.value))}
              label={label}
              invalid={invalid}
              // eslint-disable-next-line
              onChange={(option: any) => onChange(option.map((o: any) => o.value))}
              multiselect
            />
          );
        }}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </div>
  );
};

export default Dropdown;

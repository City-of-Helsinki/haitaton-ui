import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Dropdown as HdsDropdown, Tooltip } from 'hds-react';

import './dropDown.styles.scss';

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
  tooltipText?: string;
  tooltipLabelClose?: string;
  tooltipLabelOpen?: string;
};

const Dropdown: React.FC<PropTypes> = (props) => {
  const {
    name,
    id,
    control,
    rules,
    options,
    defaultValue,
    label,
    invalid,
    errorMsg,
    tooltipText,
    tooltipLabelClose,
    tooltipLabelOpen,
  } = props;

  return (
    <div className="dropdownComp">
      {tooltipText && (
        <Tooltip
          openButtonLabelText={tooltipLabelOpen || ''}
          closeButtonLabelText={tooltipLabelClose || ''}
          labelText={tooltipText}
        />
      )}
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
    </div>
  );
};
export default Dropdown;

import React from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';
import { Select, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { getInputErrorText } from '../../utils/form';
import { TooltipProps } from '../../types/tooltip';
import './dropDown.styles.scss';

type Option = { value: string; label: string };

type PropTypes = {
  id: string;
  name: string;
  control: Control;
  rules?: { required: boolean };
  defaultValue: string | null;
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
  disabled?: boolean;
  required?: boolean;
};

const Dropdown: React.FC<PropTypes> = ({
  id,
  name,
  control,
  rules,
  options,
  defaultValue,
  label,
  invalid,
  tooltip,
  disabled,
  required,
}) => {
  const { t } = useTranslation();
  const { errors } = useFormContext();
  return (
    <div className="dropdownComp">
      {!!tooltip && (
        <Tooltip buttonLabel={tooltip.buttonLabel} placement={tooltip.placement}>
          {tooltip.tooltipText}
        </Tooltip>
      )}
      <Controller
        name={name}
        id={id}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ onChange, onBlur, value }) => {
          return (
            <Select
              id={id}
              label={label}
              defaultValue={
                defaultValue
                  ? options.find((o) => o.value === defaultValue)
                  : options.find((o) => o.value === value)
              }
              options={options}
              invalid={invalid}
              value={options.find((o) => o.value === value)}
              onChange={(option: Option) => {
                if (option) onChange(option.value);
                onBlur();
              }}
              required={required}
              disabled={disabled}
            />
          );
        }}
      />
      {invalid && <span className="error-text">{getInputErrorText(t, errors, name)}</span>}
    </div>
  );
};

export default Dropdown;

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { getInputErrorText } from '../../utils/form';
import { TooltipProps } from '../../types/tooltip';
import './dropDown.styles.scss';

type Option = { value: string; label: string };

type PropTypes = {
  id: string;
  name: string;
  rules?: { required: boolean };
  defaultValue?: string | null;
  label: string;
  options: Array<Option>;
  invalid?: boolean;
  tooltip?: TooltipProps;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isOptionDisabled?: (option: any) => boolean;
  required?: boolean;
  style?: React.CSSProperties;
  onValueChange?: (value: string) => void;
};

const Dropdown: React.FC<React.PropsWithChildren<PropTypes>> = ({
  id,
  name,
  rules,
  options,
  defaultValue,
  label,
  invalid,
  tooltip,
  disabled,
  isOptionDisabled,
  required,
  style,
  onValueChange,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <div className="dropdownComp">
      {!!tooltip && (
        <Tooltip buttonLabel={tooltip.buttonLabel} placement={tooltip.placement}>
          {tooltip.tooltipText}
        </Tooltip>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
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
              invalid={invalid || Boolean(error)}
              value={options.find((o) => o.value === value) || null}
              onBlur={onBlur}
              onChange={(option: Option) => {
                if (option) {
                  onChange(option.value);
                  onValueChange && onValueChange(option.value);
                }
                onBlur();
              }}
              required={required}
              disabled={disabled}
              isOptionDisabled={isOptionDisabled}
              error={getInputErrorText(t, error)}
              style={style}
            />
          );
        }}
      />
    </div>
  );
};

export default Dropdown;

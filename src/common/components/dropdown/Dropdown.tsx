import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, SupportedLanguage, Tooltip } from 'hds-react';
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
  required,
  style,
  onValueChange,
}) => {
  const { t, i18n } = useTranslation();
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
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
          return (
            <Select
              ref={ref}
              id={id}
              texts={{
                label,
                language: i18n.language as SupportedLanguage,
                error: getInputErrorText(t, error),
              }}
              defaultValue={
                defaultValue
                  ? options.find((o) => o.value === defaultValue)?.value
                  : options.find((o) => o.value === value)?.value
              }
              options={options}
              invalid={invalid || Boolean(error)}
              value={options.find((o) => o.value === value)?.value}
              onBlur={onBlur}
              onChange={(_, clickedOption: Option) => {
                if (clickedOption) {
                  onChange(clickedOption.value);
                  onValueChange && onValueChange(clickedOption.value);
                }
                onBlur();
              }}
              required={required}
              disabled={disabled}
              style={{
                maxWidth: 'none',
                ...style,
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default Dropdown;

import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Combobox } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { TooltipProps } from '../../types/tooltip';
import { getInputErrorText } from '../../utils/form';

type Option<T> = { value: T; label: string };

type PropTypes<T> = {
  name: string;
  id: string;
  rules?: { required: boolean };
  defaultValue?: Option<T>[];
  label: string;
  helperText?: string;
  options: Array<Option<T>>;
  errorMsg?: string;
  tooltip?: TooltipProps;
  icon?: ReactNode;
  clearable?: boolean;
  placeholder?: string;
  mapValueToLabel: (value: T) => string;
  transformValue?: (value: T) => T;
};

function DropdownMultiselect<T>({
  name,
  rules,
  options,
  defaultValue,
  label,
  errorMsg,
  tooltip,
  helperText,
  icon,
  clearable,
  placeholder,
  mapValueToLabel,
  transformValue,
}: Readonly<PropTypes<T>>) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        return (
          <Combobox<Option<T>>
            options={options}
            label={label}
            helper={helperText}
            invalid={Boolean(error)}
            defaultValue={defaultValue}
            value={value?.map((v: T) => ({
              value: transformValue ? transformValue(v) : v,
              label: mapValueToLabel(v),
            }))}
            onChange={(option: Option<T>[]) => onChange(option.map((o) => o.value))}
            toggleButtonAriaLabel={t('common:components:multiselect:toggle')}
            selectedItemRemoveButtonAriaLabel={t('common:components:multiselect:removeSelected')}
            clearButtonAriaLabel={t('common:components:multiselect:clear')}
            multiselect
            icon={icon}
            clearable={clearable}
            onBlur={onBlur}
            error={errorMsg ?? getInputErrorText(t, error)}
            placeholder={placeholder}
            tooltipButtonLabel={tooltip?.tooltipButtonLabel}
            tooltipLabel={tooltip?.tooltipLabel}
            tooltipText={tooltip?.tooltipText}
          />
        );
      }}
    />
  );
}

export default DropdownMultiselect;

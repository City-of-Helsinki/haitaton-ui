import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectProps, SupportedLanguage, defaultFilter } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { getInputErrorText } from '../../utils/form';

type PropTypes<T> = {
  name: string;
  id: string;
  rules?: { required: boolean };
  label: string;
  helperText?: string;
  errorMsg?: string;
  placeholder?: string;
  mapValueToLabel: (value: T) => string;
  transformValue?: (value: T) => T;
} & SelectProps;

function DropdownMultiselect<T>({
  name,
  rules,
  options,
  label,
  errorMsg,
  tooltip,
  helperText,
  icon,
  clearable,
  placeholder,
  required,
  mapValueToLabel,
  transformValue,
}: Readonly<PropTypes<T>>) {
  const { t, i18n } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => {
        return (
          <Select
            ref={ref}
            multiSelect
            options={options}
            texts={{
              label,
              assistive: helperText,
              placeholder,
              error: errorMsg ?? getInputErrorText(t, error),
              dropdownButtonAriaLabel: t('common:components:multiselect:toggle'),
              filterClearButtonAriaLabel: t('common:components:multiselect:clear'),
              tagRemoveSelectionAriaLabel: t('common:components:multiselect:removeSelected'),
              language: i18n.language as SupportedLanguage,
            }}
            filter={defaultFilter}
            invalid={Boolean(error)}
            value={value?.map((v: T) => {
              const updatedValue = transformValue ? transformValue(v) : v;
              // If the value is not a string, stringify it
              // to ensure it can be used as a value in the select
              const stringifiedValue =
                typeof updatedValue !== 'string' ? JSON.stringify(updatedValue) : updatedValue;
              return {
                value: stringifiedValue,
                label: mapValueToLabel(v),
                selected: true,
              };
            })}
            onChange={(selectedOptions) => {
              onChange(
                selectedOptions.map((o) => {
                  let val = o.value;
                  // If the value is a JSON string,
                  // parse it to get the original object value
                  try {
                    val = JSON.parse(o.value);
                    // eslint-disable-next-line no-empty
                  } catch (_) {}
                  return val;
                }),
              );
            }}
            icon={icon}
            clearable={clearable}
            onBlur={onBlur}
            tooltip={tooltip}
            required={required}
            theme={{
              '--tag-background-color': 'var(--color-black-10)',
            }}
            style={{ maxWidth: 'none' }}
          />
        );
      }}
    />
  );
}

export default DropdownMultiselect;

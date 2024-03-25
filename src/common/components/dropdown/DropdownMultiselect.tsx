import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Combobox, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { TooltipProps } from '../../types/tooltip';

import './dropDown.styles.scss';

type Option<T> = { value: T; label: string };

type PropTypes<T> = {
  name: string;
  id: string;
  rules?: { required: boolean };
  defaultValue?: Option<T>[];
  label: string;
  helperText?: string;
  options: Array<Option<T>>;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
  icon?: ReactNode;
  clearable?: boolean;
  mapValueToLabel: (value: T) => string;
  transformValue?: (value: T) => T;
};

function DropdownMultiselect<T>({
  name,
  rules,
  options,
  defaultValue,
  label,
  invalid,
  errorMsg,
  tooltip,
  helperText,
  icon,
  clearable,
  mapValueToLabel,
  transformValue,
}: Readonly<PropTypes<T>>) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <div className="dropdownComp">
      {!!tooltip && (
        <Tooltip
          buttonLabel={tooltip.buttonLabel || t(`hankeForm:toolTips:tipOpenLabel`)}
          tooltipLabel={tooltip.tooltipLabel || t(`hankeForm:toolTips:tipOpenLabel`)}
          placement={tooltip.placement}
        >
          {t(`${tooltip.tooltipText}`)}
        </Tooltip>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          return (
            <Combobox<Option<T>>
              options={options}
              label={label}
              helper={helperText}
              invalid={invalid}
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
            />
          );
        }}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </div>
  );
}

export default DropdownMultiselect;

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { fi } from 'date-fns/esm/locale';
import formatISO from 'date-fns/formatISO';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from '../../types/tooltip';
import { getInputErrorText } from '../../utils/form';
import 'react-datepicker/dist/react-datepicker.css';
import './datePicker.styles.scss';

// https://github.com/Hacker0x01/react-datepicker/issues/1815
// you have to register the locale before importing DatePicker
// Todo: All locales should be registered correctly in Header.tsx
registerLocale('fi', fi);

type PropTypes = {
  name: string;
  label?: string;
  disabled?: boolean;
  selected?: Date;
  locale?: string;
  dateFormat?: string;
  defaultValue?: Date | string | null;
  tooltip?: TooltipProps;
};
const DatePickerComp: React.FC<PropTypes> = ({
  name,
  label,
  disabled,
  locale,
  dateFormat,
  defaultValue,
  tooltip,
}) => {
  const { t } = useTranslation();
  const { control, errors } = useFormContext();
  const invalid = !!errors[name];

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ onChange, value }) => (
          <div className="datePicker">
            <div className="topWpr">
              <label htmlFor={name}>{label}</label>
              {!!tooltip && (
                <Tooltip buttonLabel={tooltip.buttonLabel} placement={tooltip.placement}>
                  {tooltip.tooltipText}
                </Tooltip>
              )}
            </div>
            <DatePicker
              id={name}
              name={name}
              onChange={(date: Date) => date && onChange(formatISO(date))}
              selected={value ? new Date(value) : null}
              disabled={disabled}
              locale={locale}
              dateFormat={dateFormat}
              className={invalid ? 'invalid' : ''}
            />
            {invalid && <span className="error-text">{getInputErrorText(t, errors, name)}</span>}
          </div>
        )}
      />
    </>
  );
};
export default DatePickerComp;

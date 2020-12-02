import React from 'react';
import { Controller, Control } from 'react-hook-form';
import formatISO from 'date-fns/formatISO';
import DatePicker from 'react-datepicker';
import { Tooltip } from 'hds-react';
import { TooltipProps } from 'hds-react/components/Tooltip';

import 'react-datepicker/dist/react-datepicker.css';
import './datePicker.styles.scss';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  rules?: { required: boolean };
  label?: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  selected?: Date;
  locale?: string;
  dateFormat?: string;
  defaultValue?: Date | string | null;
  tooltip?: TooltipProps;
};
const DatePickerComp: React.FC<PropTypes> = (props) => {
  const {
    name,
    id,
    control,
    rules,
    label,
    invalid,
    errorMsg,
    disabled,
    locale,
    dateFormat,
    defaultValue,
    tooltip,
  } = props;
  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ onChange, value }) => (
          <div className="datePicker">
            <div>
              {!!tooltip && <Tooltip {...tooltip} />}

              <label htmlFor={id}>{label}</label>
            </div>
            <DatePicker
              id={id}
              name={name}
              onChange={(date: Date) => date && onChange(formatISO(date))}
              selected={value ? new Date(value) : null}
              disabled={disabled}
              locale={locale}
              dateFormat={dateFormat}
              className={invalid ? 'invalid' : ''}
            />
            {invalid && <span className="error-text">{errorMsg}</span>}
          </div>
        )}
      />
    </>
  );
};
export default DatePickerComp;

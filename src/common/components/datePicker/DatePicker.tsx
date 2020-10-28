import React from 'react';
import { Controller, Control } from 'react-hook-form';
import DatePicker from 'react-datepicker';

type PropTypes = {
  name: string;
  id: string;
  control: Control;
  // eslint-disable-next-line
  rules?: any;
  label?: string;
  invalid?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  // eslint-disable-next-line
  onChange?: any;
  selected?: Date;
  locale?: string;
  dateFormat?: string;
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
    selected,
    onChange,
    locale,
    dateFormat,
  } = props;
  return (
    <>
      <Controller
        name={name}
        id={id}
        control={control}
        rules={rules}
        render={() => (
          <div className="datePicker">
            <label htmlFor={id}>{label}</label>
            <DatePicker
              id={id}
              name={name}
              onChange={onChange}
              selected={selected}
              disabled={disabled}
              locale={locale}
              dateFormat={dateFormat}
            />
          </div>
        )}
      />
      {invalid && <span className="error-text">{errorMsg}</span>}
    </>
  );
};
export default DatePickerComp;

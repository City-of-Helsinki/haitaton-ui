import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateInput, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from '../../types/tooltip';
import { getInputErrorText } from '../../utils/form';
import styles from './DatePicker.module.scss';
import { convertFinnishDate, formatToFinnishDate, toEndOfDayUTCISO } from '../../utils/date';

type PropTypes = {
  name: string;
  label?: string;
  disabled?: boolean;
  selected?: Date;
  locale: 'en' | 'fi' | 'sv' | undefined;
  tooltip?: TooltipProps;
  required?: boolean;
  maxDate?: Date;
  minDate?: Date;
};

const DatePicker: React.FC<PropTypes> = ({
  name,
  label,
  disabled,
  tooltip,
  required,
  minDate,
  maxDate,
  locale,
}) => {
  const { t } = useTranslation();
  const { control, formState } = useFormContext();
  const { errors } = formState;
  const invalid = !!errors[name];

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <div className={styles.datePicker}>
            <div className={styles.tooltip}>
              {!!tooltip && (
                <Tooltip buttonLabel={tooltip.buttonLabel} placement={tooltip.placement}>
                  {tooltip.tooltipText}
                </Tooltip>
              )}
            </div>
            <div className={styles.dateInput}>
              <DateInput
                id={name}
                name={name}
                label={label}
                disabled={disabled}
                onBlur={onBlur}
                invalid={invalid}
                onChange={(date) => {
                  const convertedDateString = convertFinnishDate(date);
                  onChange(toEndOfDayUTCISO(new Date(convertedDateString)));
                }}
                value={formatToFinnishDate(value)}
                maxDate={maxDate}
                minDate={minDate}
                language={locale}
                required={required}
                disableConfirmation
                errorText={getInputErrorText(t, errors, name)}
              />
            </div>
          </div>
        )}
      />
    </>
  );
};
export default DatePicker;

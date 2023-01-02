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
  dateConvertFunction?: (value: string, valueAsDate: Date) => string | number;
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
  dateConvertFunction,
}) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  const convertDate =
    dateConvertFunction ||
    function defaultConvertDate(date) {
      const convertedDateString = convertFinnishDate(date);
      return toEndOfDayUTCISO(new Date(convertedDateString));
    };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
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
                invalid={isTouched && Boolean(error)}
                onChange={(date, valueAsDate) => {
                  onChange(convertDate(date, valueAsDate));
                }}
                value={formatToFinnishDate(value)}
                maxDate={maxDate}
                minDate={minDate}
                language={locale}
                required={required}
                disableConfirmation
                errorText={isTouched ? getInputErrorText(t, error) : undefined}
              />
            </div>
          </div>
        )}
      />
    </>
  );
};
export default DatePicker;

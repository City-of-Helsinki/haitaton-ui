import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateInput, Tooltip } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from '../../types/tooltip';
import { getInputErrorText } from '../../utils/form';
import styles from './DatePicker.module.scss';
import { convertFinnishDate, formatToFinnishDate, toEndOfDayUTCISO } from '../../utils/date';
import { useGlobalNotification } from "../globalNotification/GlobalNotificationContext";

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
  initialMonth?: Date;
  helperText?: string;
  onValueChange?: (value: string) => void;
  hankeStartDate?: Date;
  hankeEndDate?: Date;
};

const DatePicker: React.FC<React.PropsWithChildren<PropTypes>> = ({
  name,
  label,
  disabled,
  tooltip,
  required,
  minDate,
  maxDate,
  initialMonth,
  helperText,
  locale,
  onValueChange,
  hankeStartDate,
  hankeEndDate
}) => {
  const { t } = useTranslation(['form', 'hakemus', 'common', 'validations']);
  const { control, setError, clearErrors, trigger, setValue } = useFormContext();
  const { setNotification } = useGlobalNotification();

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? t('form:errors:required') : false,
          validate: (value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return t('form:validations:invalidDate');
            if (minDate && date < minDate) return t('form:errors:dateTooEarly');
            if (maxDate && date > maxDate) return t('form:errors:dateTooLate');
            if (hankeStartDate && date < hankeStartDate) return t('form:validations:dateBeforeProjectDate');
            if (hankeEndDate && date > hankeEndDate) return t('form:validations:dateFutureProjectDate');
            return true;
          }
        }}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
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
                label={label}
                disabled={disabled}
                invalid={Boolean(error)}
                value={formatToFinnishDate(value)}
                maxDate={maxDate}
                minDate={minDate}
                initialMonth={initialMonth}
                language={locale}
                required={required}
                disableConfirmation
                helperText={helperText}
                errorText={getInputErrorText(t, error)}
                ref={ref}
                onBlur={(e) => {
                  const rawValue = e.target.value;
                  const [day, month, year] = rawValue.split('.');
                  const parsedDate = new Date(`${year}-${month}-${day}`);
                  const isSameDay = (a: Date, b: Date): boolean =>
                    a.getFullYear() === b.getFullYear() &&
                    a.getMonth() === b.getMonth() &&
                    a.getDate() === b.getDate();
                  const finalizeValid = () => {
                    clearErrors(name);
                    trigger(name);
                    onBlur();
                  };
                  const notifyError = (
                    messageKey: string,
                    labelKey: string,
                    textKey: string,
                    date: Date
                  ) => {
                    setError(name, { type: 'manual', message: t(messageKey) });
                    setValue(name, '');
                    setNotification(true, {
                      position: 'top-right',
                      dismissible: true,
                      autoClose: true,
                      autoCloseDuration: 5000,
                      label: t(labelKey),
                      message: t(textKey, { date: formatToFinnishDate(date) }),
                      type: 'error',
                      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
                    });
                  };
                  if (isNaN(parsedDate.getTime())) {
                    setError(name, { type: 'manual', message: t('form:validations:invalidDate') });
                    return;
                  }
                  if (hankeStartDate) {
                    if (isSameDay(parsedDate, hankeStartDate)) {
                      finalizeValid();
                      return;
                    }
                    if (parsedDate < hankeStartDate) {
                      notifyError(
                        'dateBeforeProjectDate',
                        'hakemus:notifications:dateBeforeProjectDateLabel',
                        'hakemus:notifications:dateBeforeProjectDateText',
                        hankeStartDate
                      );
                      return;
                    }
                  }
                  if (hankeEndDate) {
                    if (isSameDay(parsedDate, hankeEndDate)) {
                      finalizeValid();
                      return;
                    }
                    if (parsedDate > hankeEndDate) {
                      notifyError(
                        'dateFutureProjectDate',
                        'hakemus:notifications:dateFutureProjectDateLabel',
                        'hakemus:notifications:dateFutureProjectDateText',
                        hankeEndDate
                      );
                      return;
                    }
                  }
                  finalizeValid();
                }}
                onChange={(date) => {
                  const convertedDateString = convertFinnishDate(date);
                  onChange(toEndOfDayUTCISO(new Date(convertedDateString)));
                  clearErrors(name);
                  if (onValueChange) {
                    onValueChange(date);
                  }
                }}
                crossOrigin=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              />
            </div>
          </div>
        )}
      />
    </>
  );
};
export default DatePicker;

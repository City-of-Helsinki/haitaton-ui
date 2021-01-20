import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconCalendar } from 'hds-react';
import DatePicker from 'react-datepicker';
import styles from './DateRangeControl.module.scss';

const DateRangeControl: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());

  const { i18n } = useTranslation();

  return (
    <div className={styles.dateRangeControl}>
      <p>Ajanjakson alku</p>
      <div>
        <div className={styles.datePicker}>
          <DatePicker
            locale={i18n.language}
            dateFormat="dd.MM.yyyy"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />
          <IconCalendar aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default DateRangeControl;

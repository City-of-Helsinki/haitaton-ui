import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import { toStartOfDayUTCISO, toEndOfDayUTCISO, formatToFinnishDate } from '../../../utils/date';
import CalendarIcon from '../../icons/Calendar';
import styles from './DateRangeControl.module.scss';

type Props = {
  startDate: string | null;
  updateStartDate: (data: string) => void;
  endDate: string | null;
  updateEndDate: (data: string) => void;
  isClearable?: boolean;
};

const startPicker = 'startPicker';
const endPicker = 'endPicker';

const DateRangeControl: React.FC<Props> = ({
  startDate,
  endDate,
  updateStartDate,
  updateEndDate,
  isClearable,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.datePicker}>
      <Grid templateColumns="repeat(9, 1fr)" w="360px">
        <GridItem colSpan={4}>
          <div>
            <label htmlFor={startPicker} className={styles.label}>
              {t('map:dateRange:begin')}
            </label>
            <div className={styles.dateWpr}>
              <ReactDatePicker
                id={startPicker}
                onChange={(date: Date) => {
                  if (date) {
                    updateStartDate(toStartOfDayUTCISO(date));
                  } else {
                    updateStartDate(date);
                  }
                }}
                value={startDate ? formatToFinnishDate(startDate) : undefined}
                selected={startDate ? new Date(startDate) : null}
                maxDate={endDate ? new Date(endDate) : null}
                locale={i18n.language}
                isClearable={isClearable}
              />
              {!isClearable && <CalendarIcon />}
            </div>
          </div>
        </GridItem>
        <GridItem colSpan={1} className={styles.dateHyphen} aria-hidden>
          <p>-</p>
        </GridItem>
        <GridItem colSpan={4}>
          <div>
            <label htmlFor={endPicker} className={styles.label}>
              {t('map:dateRange:end')}
            </label>
            <div className={styles.dateWpr}>
              <ReactDatePicker
                id={endPicker}
                onChange={(date: Date) => {
                  if (date) {
                    updateEndDate(toEndOfDayUTCISO(date));
                  } else {
                    updateEndDate(date);
                  }
                }}
                value={endDate ? formatToFinnishDate(endDate) : undefined}
                selected={endDate ? new Date(endDate) : null}
                minDate={startDate ? new Date(startDate) : null}
                locale={i18n.language}
                className={styles.reactDatepicker}
                isClearable={isClearable}
              />
              {!isClearable && <CalendarIcon />}
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default DateRangeControl;

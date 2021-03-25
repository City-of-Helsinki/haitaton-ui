import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import ControlPanel from './ControlPanel';
import { toStartOfDayUTCISO, toEndOfDayUTCISO, formatToFinnishDate } from '../../../utils/date';
import CalendarIcon from '../../icons/Calendar';
import styles from './DateRangeControl.module.scss';

type Props = {
  startDate: string;
  updateStartDate: (data: string) => void;
  endDate: string;
  updateEndDate: (data: string) => void;
};

const startPicker = 'startPicker';
const endPicker = 'endPicker';

const DateRangeControl: React.FC<Props> = ({
  startDate,
  endDate,
  updateStartDate,
  updateEndDate,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <ControlPanel className={styles.dateRangeControl}>
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
                    updateStartDate(toStartOfDayUTCISO(date));
                  }}
                  value={formatToFinnishDate(startDate)}
                  selected={new Date(startDate)}
                  maxDate={new Date(endDate)}
                  locale={i18n.language}
                  data-testid="filterStartDateInput"
                />
                <CalendarIcon />
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
                    updateEndDate(toEndOfDayUTCISO(date));
                  }}
                  value={formatToFinnishDate(endDate)}
                  selected={new Date(endDate)}
                  minDate={new Date(startDate)}
                  locale={i18n.language}
                  className={styles.reactDatepicker}
                />
                <CalendarIcon />
              </div>
            </div>
          </GridItem>
        </Grid>
      </div>
    </ControlPanel>
  );
};

export default DateRangeControl;

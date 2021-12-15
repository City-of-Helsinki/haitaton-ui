import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from 'hds-react';
import { toStartOfDayUTCISO, toEndOfDayUTCISO, formatToFinnishDate } from '../../../utils/date';
import styles from './DateRangeControl.module.scss';
import useLocale from '../../../hooks/useLocale';

type Props = {
  startDate: string | null;
  updateStartDate: (data: string) => void;
  endDate: string | null;
  updateEndDate: (data: string) => void;
};

const startPicker = 'startPicker';
const endPicker = 'endPicker';
const ddmmyyyyRegex = /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}/;

const DateRangeControl: React.FC<Props> = ({
  startDate,
  endDate,
  updateStartDate,
  updateEndDate,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <div className={styles.datePicker}>
      <Grid templateColumns="repeat(9, 1fr)" w="360px">
        <GridItem colSpan={4}>
          <div>
            <DateInput
              id={startPicker}
              value={startDate ? formatToFinnishDate(startDate) : undefined}
              initialMonth={new Date()}
              label={t('map:dateRange:begin')}
              language={locale}
              onChange={(e) => {
                if (e.match(ddmmyyyyRegex)) {
                  const dateSplit = e.split('.');
                  const selectedDate = new Date(`${dateSplit[1]}.${dateSplit[0]}.${dateSplit[2]}`);
                  updateStartDate(toStartOfDayUTCISO(selectedDate));
                } else {
                  updateStartDate('');
                }
              }}
              maxDate={endDate ? new Date(endDate) : undefined}
              disableConfirmation
            />
          </div>
        </GridItem>
        <GridItem colSpan={1} className={styles.dateHyphen} aria-hidden>
          <p>-</p>
        </GridItem>
        <GridItem colSpan={4}>
          <DateInput
            id={endPicker}
            value={endDate ? formatToFinnishDate(endDate) : undefined}
            label={t('map:dateRange:end')}
            language={locale}
            onChange={(e) => {
              if (e.match(ddmmyyyyRegex)) {
                const dateSplit = e.split('.');
                const selectedDate = new Date(`${dateSplit[1]}.${dateSplit[0]}.${dateSplit[2]}`);
                updateEndDate(toEndOfDayUTCISO(selectedDate));
              } else {
                updateEndDate('');
              }
            }}
            minDate={startDate ? new Date(startDate) : undefined}
            disableConfirmation
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default DateRangeControl;

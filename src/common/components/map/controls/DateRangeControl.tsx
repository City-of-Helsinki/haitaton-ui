import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from 'hds-react';
import styles from './DateRangeControl.module.scss';
import useLocale from '../../../hooks/useLocale';
import { formatToFinnishDate, toEndOfDayUTCISO, toStartOfDayUTCISO } from '../../../utils/date';

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
              value={!startDate ? undefined : formatToFinnishDate(startDate)}
              initialMonth={new Date()}
              label={t('map:dateRange:begin')}
              maxLength={10}
              language={locale}
              onChange={(e) => {
                if (e.match(ddmmyyyyRegex)) {
                  const dateSplit = e.split('.');
                  const day = dateSplit[0];
                  const month = dateSplit[1];
                  const year = dateSplit[2];

                  if (parseInt(day, 10) > 31 || parseInt(month, 10) > 12) {
                    updateStartDate('');
                  } else {
                    // allow users to type in both 1.1.2020 and 01.01.2020
                    // and 1.10.2020 etc
                    const selectedDate = new Date(
                      ` ${year}-${month.length === 1 ? `0${month}` : month}-${
                        day.length === 1 ? `0${day}` : day
                      }`
                    );
                    updateStartDate(toStartOfDayUTCISO(selectedDate).toString());
                  }
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
            value={!endDate ? undefined : formatToFinnishDate(endDate)}
            label={t('map:dateRange:end')}
            language={locale}
            maxLength={10}
            onChange={(e) => {
              if (e.match(ddmmyyyyRegex)) {
                const dateSplit = e.split('.');
                const day = dateSplit[0];
                const month = dateSplit[1];
                const year = dateSplit[2];
                // allow users to type in both 1.1.2020 and 01.01.2020
                // and 1.10.2020 etc
                const selectedDate = new Date(
                  ` ${year}-${month.length === 1 ? `0${month}` : month}-${
                    day.length === 1 ? `0${day}` : day
                  }`
                );
                updateEndDate(toEndOfDayUTCISO(selectedDate).toString());
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

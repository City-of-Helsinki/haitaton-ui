import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateInput } from 'hds-react';
import styles from './DateRangeControl.module.scss';
import useLocale from '../../../hooks/useLocale';
import {
  convertFinnishDate,
  formatToFinnishDate,
  toEndOfDayUTCISO,
  toStartOfDayUTCISO,
} from '../../../utils/date';

type Props = {
  startDate: string | null;
  updateStartDate: (data: string) => void;
  endDate: string | null;
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
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <div className={styles.container}>
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
                const convertedDateString = convertFinnishDate(e);
                if (convertedDateString.length > 0) {
                  updateStartDate(toStartOfDayUTCISO(new Date(convertedDateString)));
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
              const convertedDateString = convertFinnishDate(e);
              if (convertedDateString.length > 0) {
                updateEndDate(toEndOfDayUTCISO(new Date(convertedDateString)));
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

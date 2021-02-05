import { GridItem, Grid } from '@chakra-ui/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../datePicker/DatePicker';
import ControlPanel from './ControlPanel';
import styles from './DateRangeControl.module.scss';
import { HankeFilters } from '../../../../domain/map/types';

type Props = {
  // eslint-disable-next-line
  onSubmit: (data: any) => void;
  startDate: string;
  endDate: string;
};

const DateRangeControl: React.FC<Props> = ({ onSubmit, startDate, endDate }) => {
  const { t, i18n } = useTranslation();

  // TODO: go through options in
  // https://react-hook-form.com/api
  const formContext = useForm<HankeFilters>({});

  const { register, handleSubmit } = useForm({
    defaultValues: {
      startDate,
      endDate,
    },
  });

  return (
    <ControlPanel className={styles.dateRangeControl}>
      <FormProvider {...formContext}>
        <div className={styles.datePicker}>
          <form name="dateRange" onSubmit={handleSubmit(onSubmit)}>
            <input type="date" name="startDate" ref={register} />
            <input type="date" name="endDate" ref={register} />
            <input type="submit" />
            <Grid templateColumns="repeat(9, 1fr)" gap={6}>
              <GridItem colSpan={4}>
                <DatePicker
                  name="startDate"
                  label={t(`map:dateRange:begin`)}
                  locale={i18n.language}
                  dateFormat="dd.MM.yyyy"
                  defaultValue={null}
                  tooltip={{
                    tooltipText: t(`map:dateRange:begin`),
                    tooltipLabel: t(`map:dateRange:begin`),
                    placement: 'auto',
                  }}
                  required={false}
                />
              </GridItem>
              <GridItem colSpan={1} className={styles.dateHyphen}>
                <p>─</p>
              </GridItem>
              <GridItem colSpan={4}>
                <DatePicker
                  name="endDate"
                  label={t(`map:dateRange:end`)}
                  dateFormat="dd.MM.yyyy"
                  defaultValue={null}
                  locale={i18n.language}
                  required={false}
                  tooltip={{
                    tooltipText: t(`map:dateRange:end`),
                    tooltipLabel: t(`map:dateRange:end`),
                    placement: 'auto',
                  }}
                />
              </GridItem>
            </Grid>
          </form>
        </div>
      </FormProvider>
    </ControlPanel>
  );
};

export default DateRangeControl;

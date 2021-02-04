import React from 'react';
import { useForm } from 'react-hook-form';
import ControlPanel from './ControlPanel';
import styles from './DateRangeControl.module.scss';

type Props = {
  // eslint-disable-next-line
  onSubmit: (data: any) => void;
  startDate: string;
  endDate: string;
  setStartDate: (data: any) => void;
  setEndDate: (data: any) => void;
};

const DateRangeControl: React.FC<Props> = ({ onSubmit, startDate, endDate }) => {
  // TODO: go through options in
  // https://react-hook-form.com/api
  /*
  const formContext = useForm<HankeDataFormState>({
    mode: 'all', // TODO: only when "käytä valintoja" is pressed
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
    shouldUnregister: false,
    defaultValues: {}, // TODO: take default current year start + next year end from state
    context: {
      formPage,
    },
  });


            <DatePicker
              name="asd"
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

   */

  const { register, handleSubmit } = useForm({
    defaultValues: {
      periodBegin: startDate,
      periodEnd: endDate,
    },
  });

  return (
    <ControlPanel className={styles.dateRangeControl}>
      <div>
        <div className={styles.datePicker}>
          <form name="dateRange" onSubmit={handleSubmit(onSubmit)}>
            <input type="date" name="periodBegin" ref={register} />
            <input type="date" name="periodEnd" ref={register} />
            <input type="submit" />
          </form>
        </div>
      </div>
    </ControlPanel>
  );
};

export default DateRangeControl;

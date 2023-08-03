import React from 'react';
import { formatToFinnishDate } from '../../../common/utils/date';

function ApplicationDates({
  startTime,
  endTime,
}: {
  startTime: string | null;
  endTime: string | null;
}) {
  if (startTime === null || endTime === null) {
    return <div />;
  }

  return (
    <p>
      {formatToFinnishDate(startTime)}–{formatToFinnishDate(endTime)}
    </p>
  );
}

export default ApplicationDates;

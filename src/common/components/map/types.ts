import * as ol from 'ol';

export type MapInstance = ol.Map | null;

export class OverlayProps {
  heading?: string | null;
  subHeading?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  backgroundColor?: string;

  constructor(props: OverlayProps) {
    this.heading = props.heading;
    this.subHeading = props.subHeading;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.backgroundColor = props.backgroundColor;
  }
}

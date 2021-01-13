export type headerTypes = {
  Header: string;
  // eslint-disable-next-line
  accessor: any;
};
export interface TableProps {
  columns: Array<headerTypes>;
  // eslint-disable-next-line
  data: any;
}

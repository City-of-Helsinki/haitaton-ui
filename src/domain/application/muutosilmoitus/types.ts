export type MuutosilmoitusSent = Date | null;

export type Muutosilmoitus<T> = {
  id: string;
  applicationData: T;
  sent: MuutosilmoitusSent;
};

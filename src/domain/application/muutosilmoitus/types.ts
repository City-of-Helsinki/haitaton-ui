export type MuutosilmoitusSent = string | null;

export type Muutosilmoitus<T> = {
  id: string;
  applicationData: T;
  sent: MuutosilmoitusSent;
};

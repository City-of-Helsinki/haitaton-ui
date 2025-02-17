export type Muutosilmoitus<T> = {
  id: string;
  applicationData: T;
  sent: Date | null;
};

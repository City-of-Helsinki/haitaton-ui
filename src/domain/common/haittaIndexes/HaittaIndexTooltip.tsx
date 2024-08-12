import { Tooltip } from 'hds-react';

type Props = {
  children: React.ReactNode;
};

export default function HaittaIndexTooltip({ children }: Readonly<Props>) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Tooltip>{children}</Tooltip>
    </div>
  );
}

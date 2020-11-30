import React from 'react';
import { Combobox, Tooltip, TooltipProps } from 'hds-react';

export type Option = { value: string | number; label: string };

type Options = Array<Option>;

type PropTypes = {
  defaultValue: Partial<Option>;
  label: string;
  options: Options;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
  onChange: (value: Option) => void;
  className: string;
};

const findSelected = (options: Options, defaultValue?: Partial<Option>) =>
  defaultValue
    ? options.find((o) => o.value === defaultValue.value || o.label === defaultValue.label)
    : undefined;

const Autocomplete: React.FC<PropTypes> = ({
  options,
  defaultValue,
  label,
  invalid,
  errorMsg,
  onChange,
  tooltip,
  ...rest
}) => (
  <div className="autocomplete">
    {!!tooltip && <Tooltip {...tooltip} />}
    <Combobox
      label={label}
      options={options}
      defaultValue={findSelected(options, defaultValue)}
      // value={findSelected(options, defaultValue)}
      onChange={(option: Option) => onChange(option)}
      {...rest}
    />
    {invalid && <span className="error-text">{errorMsg}</span>}
  </div>
);

export default Autocomplete;

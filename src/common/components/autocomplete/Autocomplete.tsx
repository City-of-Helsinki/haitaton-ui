import React from 'react';
import { Combobox, Tooltip } from 'hds-react';
import { TooltipProps } from '../../types/tooltip';

export type Option = { value: string | number | null; label: string } | null;

type Options = Array<Option>;

type PropTypes = {
  id: string;
  value: Partial<Option>;
  label: string;
  options: Options;
  invalid?: boolean;
  errorMsg?: string;
  tooltip?: TooltipProps;
  onChange: (value: Option) => void;
  className: string;
  disabled?: boolean;
};

const findSelected = (options: Option[], defaultValue?: Partial<Option>) =>
  defaultValue
    ? options.find((o) => {
        if (o === null) {
          return true;
        }
        return o.value === defaultValue.value || o.label === defaultValue.label;
      })
    : { label: '', value: null };

const Autocomplete: React.FC<PropTypes> = ({
  id,
  options,
  value,
  label,
  invalid,
  errorMsg,
  onChange,
  tooltip,
  disabled,
  ...rest
}) => (
  <div className="autocomplete">
    {!!tooltip && <Tooltip {...tooltip} />}
    <Combobox<Option>
      id={id}
      label={label}
      options={options}
      toggleButtonAriaLabel="open"
      value={findSelected(options, value)}
      onChange={(option: Option) => onChange(option)}
      disabled={disabled}
      data-test-id={id}
      {...rest}
    />
    {invalid && <span className="error-text">{errorMsg}</span>}
  </div>
);

export default Autocomplete;

import { ButtonProps, Button as HDSButton } from 'hds-react';
import LoadingSpinner from '../spinner/LoadingSpinner';

type Props = ButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
};

/**
 * A Button component that wraps the HDS Button component and provides
 * handling for loading state.
 */
export default function Button({
  isLoading,
  loadingText,
  iconStart,
  disabled,
  children,
  ...rest
}: Readonly<Props>) {
  const buttonIconStart = isLoading ? <LoadingSpinner small /> : iconStart;
  const buttonText = isLoading && loadingText ? loadingText : children;

  return (
    <HDSButton iconStart={buttonIconStart} disabled={disabled || isLoading} {...rest}>
      {buttonText}
    </HDSButton>
  );
}

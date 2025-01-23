import { SKIP_TO_ELEMENT_ID } from '../../constants/constants';
import Text, { Props as TextProps } from '../text/Text';

type Props = {
  children: React.ReactNode;
};

export default function MainHeading({ children, ...rest }: Readonly<Props & Partial<TextProps>>) {
  return (
    <Text tag="h1" styleAs="h1" id={SKIP_TO_ELEMENT_ID} tabIndex={-1} aria-live="polite" {...rest}>
      {children}
    </Text>
  );
}

import React from 'react';
import clsx from 'clsx';
import styles from './Text.module.scss';

export type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
export type Weight = 'bold' | 'normal' | 'light';
export type StyleAs =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-s'
  | 'body-m'
  | 'body-l'
  | 'body-xl';

export type Spacing = '3-xs' | '2-xs' | 'xs' | 's' | 'm' | 'l';

export type Props = {
  tag: Tag;
  weight?: Weight;
  children: React.ReactNode;
  styleAs?: StyleAs;
  spacing?: Spacing;
  spacingBottom?: Spacing;
  spacingTop?: Spacing;
  className?: string;
};

const Text = ({
  children,
  tag,
  weight = 'normal',
  styleAs,
  spacing,
  spacingBottom,
  spacingTop,
  className,
  ...rest
}: Props) => {
  const Component = tag;

  return (
    <Component
      className={clsx(className, {
        [styles[`text--${weight}`]]: weight,
        [styles[`text--${styleAs}`]]: styleAs,
        [styles[`text--spacing-${spacing}`]]: spacing,
        [styles[`text--spacing-top-${spacingTop}`]]: spacingTop,
        [styles[`text--spacing-bottom-${spacingBottom}`]]: spacingBottom,
      })}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;

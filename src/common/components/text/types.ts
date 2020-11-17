export type TextComponent = 'h1' | 'h2' | 'h3' | 'h4';

export type TextComponentProps = {
  children: string;
  stylesAs?: TextComponent;
};

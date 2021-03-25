export enum LANGUAGES {
  fi = 'fi',
  en = 'en',
  sv = 'sv',
}

export type Language = keyof typeof LANGUAGES;

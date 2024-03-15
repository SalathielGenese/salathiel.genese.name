export const routes = {
  home: (languageTag: string) => languageTag!,
  hire: (languageTag: string) => ({
    'en-GB': `${languageTag}/hire`,
    'fr-FR': `${languageTag}/recruter`,
  })[languageTag]!,
  blog: (languageTag: string) => `${languageTag}/blog`,
} as const;

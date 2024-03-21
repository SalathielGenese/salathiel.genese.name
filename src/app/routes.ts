export const routes = {
  home: (languageTag: string) => languageTag!,
  editor: (languageTag: string) => ({
    'en-GB': `${languageTag}/editor`,
    'fr-FR': `${languageTag}/editeur`,
  })[languageTag]!,
  hire: (languageTag: string) => ({
    'en-GB': `${languageTag}/hire`,
    'fr-FR': `${languageTag}/recruter`,
  })[languageTag]!,
  blog: (languageTag: string) => `${languageTag}/blog`,
  article: (languageTag: string, slug = ':slug') => `${languageTag}/blog/${slug}`,
} as const;

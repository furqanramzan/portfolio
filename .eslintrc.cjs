/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@antfu',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/strict',
    'prettier',
  ],
  plugins: ['jsx-a11y', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@antfu',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/strict',
    'prettier',
  ],
  plugins: ['jsx-a11y'],
  globals: {
    NodeJS: true,
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
    {
      files: ['./**/*.{astro,js,ts}'],
      rules: {
        '@stylistic/ts/brace-style': 'off',
        '@stylistic/ts/member-delimiter-style': 'off',
        '@stylistic/js/operator-linebreak': 'off',
      },
    },
  ],
};

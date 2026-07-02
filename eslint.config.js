import antfu from '@antfu/eslint-config';
import prettierConflicts from 'eslint-config-prettier';

export default antfu(
  {
    astro: true,
    ignores: ['**/dist/', '**/.astro/', '**/node_modules/'],
  },
  prettierConflicts,
);

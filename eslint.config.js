import babelParser from '@babel/eslint-parser';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 11,
      sourceType: 'module',
    },
    ignores: ['**/node_modules', '**/test-results', '**/coverage'],
  },

  // must be last item in config so other options are overridden;
  // see https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
];

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['**/node_modules', '**/test-results', '**/coverage'],
  },

  // must be last item in config so other options are overridden;
  // see https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#configuration-new-eslintconfigjs
  eslintPluginPrettierRecommended,
];

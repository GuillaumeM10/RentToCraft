import eslintNestConfig from '@rent-to-craft/eslint-config/nest.js';

export default [
  ...eslintNestConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
];

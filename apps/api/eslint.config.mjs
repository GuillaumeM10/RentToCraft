import eslintNestConfig from '@rent-to-craft/eslint-config/nest.js';

export default [
  ...eslintNestConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

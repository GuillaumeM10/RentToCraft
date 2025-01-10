// @ts-check

import globals from 'globals';

import baseConfig from './configs/base.js';
import typescriptConfig from './configs/typescript.js';
import jsdocConfig from './configs/jsdoc.js';
import sonarjsConfig from './configs/sonarjs.js';
import unicornConfig from './configs/unicorn.js';
import promiseConfig from './configs/promise.js';
import tseslint from 'typescript-eslint';
import unusedImports from './configs/unused-imports.js';
//import jsonConfig from './configs/json.js';
import stylisticConfig from './configs/stylistic.js';
import perfectionistConfig from './configs/perfectionist.js';

export default tseslint.config(
  //...jsonConfig,
  ...baseConfig,
  ...typescriptConfig,
  ...jsdocConfig,
  ...sonarjsConfig,
  ...unicornConfig,
  ...promiseConfig,
  ...unusedImports,
  ...stylisticConfig,
  ...perfectionistConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: true,
      },
    },

    rules: {
      '@typescript-eslint/no-invalid-this': 'off', // why?
      '@typescript-eslint/quotes': 'off', // why?
      'sonarjs/function-return-type': 'off',
      '@typescript-eslint/no-misused-promises': 'off'
    },
    ignores: [
      '**/dist/',
      '**/build/',
      '**/logs/',
      'tsconfig.**',
      '**/eslint.config.mjs',
    ],
  },
);

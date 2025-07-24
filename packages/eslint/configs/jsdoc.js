// @ts-check

import jsdocPlugin from 'eslint-plugin-jsdoc';

import tseslint from 'typescript-eslint';

export default tseslint.config(jsdocPlugin.configs['flat/recommended'], {
  rules: {
    /** Useless for typescript */
    'jsdoc/require-param': 0,
    'jsdoc/require-returns': 0,
    'jsdoc/newline-after-description': 0,
    'jsdoc/check-tag-names': ['warn', { definedTags: ['link'] }],
  },
});

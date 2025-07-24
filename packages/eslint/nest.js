// @ts-check

import tseslint from "typescript-eslint";
import baseConfigs from "./base.js";

export default tseslint.config(...baseConfigs, {
  rules: {
    // Both should be active, but needs refacto...
    strictNullChecks: 0,
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "sonarjs/prefer-nullish-coalescing": "off",
    "unicorn/prefer-module": "off",
    "unicorn/import-style": "off",
  },
});

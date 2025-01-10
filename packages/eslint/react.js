// @ts-check

import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import baseConfigs from "./base.js";
import { fixupPluginRules } from "@eslint/compat";

export default tseslint.config(
  ...baseConfigs,
  // @ts-ignore
  reactPlugin.configs.flat.recommended,
  // @ts-ignore
  reactPlugin.configs.flat["jsx-runtime"],
  {
    plugins: {
      // @ts-ignore
      "react-hooks": fixupPluginRules(reactHooksPlugin),
    },
    ignores: ["**/.expo/**", "**/build/**"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prefer-read-only-props": "warn",
      "react/display-name": "off",

      // useless with TS
      "react/prop-types": "off",

      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            args: true,
            props: true,
            Props: true,
            Prop: true,
            prop: true,
            params: true,
            ref: true,
            Ref: true,
            Param: true,
            Params: true,
            env: true,
            ctx: true,
            fn: true,
            Fn: true,
          },
        },
      ],
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        {
          selector: "variable",
          format: null,
          filter: {
            regex: "^_$",
            match: true,
          },
        },
        {
          selector: "function",
          format: ["PascalCase", "camelCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          format: null,
          filter: {
            regex: "[- ]",
            match: true,
          },
        },
        {
          selector: "objectLiteralProperty",
          format: null,
          filter: {
            regex: "(^\\d|[-/ ])",
            match: true,
          },
        },
        {
          selector: "enumMember",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "property",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "method",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          modifiers: ["static"],
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          modifiers: ["protected"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "import",
          format: ["PascalCase", "camelCase"],
        },
      ],
    },
  },
);

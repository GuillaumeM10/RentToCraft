import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintNestConfig from "@rent-to-craft/eslint-config/react.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...eslintNestConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "sonarjs/jsx-no-useless-fragment": "off",
      "perfectionist/sort-object-types": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;

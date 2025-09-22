import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettierConfig from "eslint-config-prettier";


export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: react,
    },
    rules: {
      ...react.configs.recommended.rules,
      // Add or override custom rules here
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off"
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig
);

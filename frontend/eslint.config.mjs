import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin
    },
    settings: {
      react: {
        version: "18.2.0"
      }
    },
    rules: {
      "react/prop-types": "warn",
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off"
    }
  }
];

import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      // ✅ Allow unused variables if prefixed with _
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignore unused function arguments that start with _
          varsIgnorePattern: "^_", // Ignore unused variables that start with _
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
]);

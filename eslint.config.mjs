import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "react/display-name": "off",
            "react/no-unescaped-entities": "off",
            "@next/next/no-img-element": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "react/jsx-sort-props": "error",
        },
    },
    {
        ignores: ["**/public/**", "**/.next/**", "**/dist/**"],
    },
];

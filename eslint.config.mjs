// Native flat ESLint config. `eslint-config-next` v16 ships flat config arrays
// directly, so we import them without the `@eslint/eslintrc` FlatCompat shim
// (which trips on a circular ref in `eslint-plugin-react.configs` and crashes
// the entire run). This is a pure ESM config.

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
    ...nextCoreWebVitals,
    ...nextTypeScript,
    prettier,
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'react/jsx-sort-props': 'error',
        },
    },
    {
        ignores: ['**/public/**', '**/.next/**', '**/dist/**', 'scripts/**'],
    },
];

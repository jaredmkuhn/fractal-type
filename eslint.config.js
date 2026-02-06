import js from '@eslint/js';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    { ignores: ['dist', 'node_modules', 'coverage'] },
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    {
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    js.configs.recommended,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
];

import path from 'path';
import { fileURLToPath } from 'url';

/** Parser Object */
import parser from '@typescript-eslint/parser';

/** Plugins Config */
import pluginJs from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Note: In ESLint Flat Config file system extends:[] setup moved -> under rules */

const ignoreConfig = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/public/**',
    '**/coverage/**',
    '**/*.config.js',
    '**/*.config.ts',
  ],
};

const baseConfig = {
  files: ['src/**/*.ts', 'src/**/*.tsx', 'kfone_config/*'],
  languageOptions: {
    parser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      browser: true,
      es2022: true,
      console: 'readonly',
      document: 'readonly',
      window: 'readonly',
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: ['./tsconfig.json', './tsconfig.node.json'],
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
    import: importPlugin,
    'jsx-a11y': jsxA11yPlugin,
    prettier: prettierPlugin,
  },
  rules: {
    ...(pluginJs.configs.recommended?.rules || {}),
    ...(typescriptEslintPlugin.configs['recommended-type-checked']?.rules || {}),
    ...(typescriptEslintPlugin.configs['stylistic-type-checked']?.rules || {}),
    ...(reactPlugin.configs.recommended?.rules || {}),
    ...(reactPlugin.configs['jsx-runtime']?.rules || {}),
    ...(reactHooksPlugin.configs.recommended?.rules || {}),
    ...(importPlugin.configs.recommended?.rules || {}),
    ...(jsxA11yPlugin.configs.recommended?.rules || {}),
    ...(prettierPlugin.configs.prettier?.rules || {}),
    /** TypeScript ESLint rules */
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'enumMember',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    /** Import rules */
    'import/default': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    /** React Refresh rules */
    'react-refresh/only-export-components': 'warn',
    /** Prettier rules */
    'prettier/prettier': 'error',
    /** Other Rules */
    'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
};

export default [ignoreConfig, { ...baseConfig }];

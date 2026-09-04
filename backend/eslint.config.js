import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // ===============================
  // IGNORE FILE NON-SOURCE
  // ===============================
  {
    ignores: [
      '**/dist/**',
      '**/deployment/**',
      '**/docs/**',
      '**/node_modules/**',
      '**/uploads/**',
      '**/swagger-ui/**',

      '*.js',
      '*.cjs',
      '*.mjs',
    ],
  },

  // ===============================
  // 🔥 MATIKAN CORE RULE GLOBAL
  // (INI KUNCI UTAMA)
  // ===============================
  {
    rules: {
      'no-unused-vars': 'off',
    },
  },

  // ===============================
  // BASE CONFIG (Node only)
  // ===============================
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  eslint.configs.recommended,
  prettier,

  // ===============================
  // SOURCE CODE (src)
  // ===============================
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',

      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      'prettier/prettier': 'error',
    },
  },

  // ===============================
  // TEST FILES (Jest)
  // ===============================
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-undef': 'off', // ← untuk jest.fn(), describe, dll
    },
  },

  // ===============================
  // DECLARATION FILES (*.d.ts)
  // ===============================
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];

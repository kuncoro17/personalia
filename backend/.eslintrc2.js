import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'uploads/',
      'docs/',
      '*.js',
      '.eslintrc.js',
      '**/*.d.ts',
    ],
  },

  eslint.configs.recommended,

  // 🔥 MATIKAN CORE no-unused-vars (INI KUNCI)
  {
    rules: {
      'no-unused-vars': 'off',
    },
  },

  prettier,

  // 🔹 SEMUA FILE TS
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // 🔹 FILE TEST
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // 🔹 FILE DECLARATION
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];

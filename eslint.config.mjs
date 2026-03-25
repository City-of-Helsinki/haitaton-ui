import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default tseslint.config(
  // Files to ignore (replaces ignorePatterns)
  {
    ignores: [
      'eslint.config.mjs',
      'build/**',
      'public/**',
      'src/vitest.polyfills.js',
      'src/react-app-env.d.ts',
      'src/serviceWorker.ts',
      'scripts/update-runtime-env.ts',
      'scripts/translate-common.ts',
      'scripts/translate-excel-to-json.ts',
      'scripts/translate-json-to-excel.ts',
    ],
  },

  // Base recommended configs
  ...tseslint.configs.recommended,

  // React hooks plugin
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // TypeScript-aware settings and custom rules for all source files
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none', varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'object-curly-spacing': ['warn', 'always'],
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'no-underscore-dangle': ['error', { allow: ['__typename', '_env_'] }],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
    },
  },

  // Jest globals for test files
  {
    files: ['**/*.test.tsx', '**/*.test.ts'],
    plugins: { jest },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      // require() is needed inside vi.mock() factory functions
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
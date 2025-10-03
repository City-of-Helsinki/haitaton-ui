import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...typescript.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'build/**',
      'public/**',
      'coverage/**',
      'e2e/**',
      'node_modules/**',
      'src/react-app-env.d.ts',
      'src/serviceWorker.ts',
      'scripts/update-runtime-env.ts',
      'scripts/translate-common.ts',
      'scripts/translate-excel-to-json.ts',
      'scripts/translate-json-to-excel.ts',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react-hooks': reactHooks,
      jest: jest,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'object-curly-spacing': ['warn', 'always'],
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
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/setupTests.ts',
      '**/testUtils/**/*.{ts,tsx}',
      '**/src/testUtils/**/*.{ts,tsx}',
    ],
    ...jest.configs['flat/recommended'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        process: 'readonly',
        global: 'readonly',
        require: 'readonly',
        NodeJS: 'readonly',
        jest: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      jest,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  // Configuration for Node.js files that need require() imports
  {
    files: ['src/jest.polyfills.js', 'src/setupProxy.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',
      },
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },
];

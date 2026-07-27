import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // 1. Use standard recommended JavaScript rules
  js.configs.recommended,

  // 2. Turn off any ESLint rules that conflict with Prettier
  eslintConfigPrettier,

  // 3. Your custom rules and environment settings
  {
    languageOptions: {
      // This tells ESLint that process, console, __dirname, etc. are valid built-ins
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'off',
      'spaced-comment': 'off',
      'no-console': 'warn',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
    },
  },
];

// @ts-check

import { defineConfig } from '@vben/eslint-config';

export default defineConfig([
  {
    rules: {
      'unicorn/numeric-separators-style': 'off',
      'unicorn/number-literal-case': 'off',
      'no-restricted-globals': 'off'
    },
    ignorePatterns: [
      "env.d.ts"
    ]
  },
]);

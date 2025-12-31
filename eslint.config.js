import js from '@eslint/js';
import globals from 'globals';
import css from '@eslint/css';
import jsdoc from 'eslint-plugin-jsdoc';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      jsdoc,
      stylistic
    },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        __VERSION__: 'readonly'
      }
    },
    rules: {
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-property-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/check-values': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'error',
      'stylistic/arrow-parens': ['error', 'always'],
      'stylistic/arrow-spacing': ['error', { before: true, after: true }],
      'stylistic/block-spacing': ['error', 'always'],
      'stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'stylistic/comma-dangle': ['error', 'never'],
      'stylistic/comma-spacing': ['error', { before: false, after: true }],
      'stylistic/comma-style': ['error', 'last'],
      'stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      'stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
      'stylistic/keyword-spacing': ['error', { before: true, after: true }],
      'stylistic/lines-between-class-members': ['error', 'always'],
      'stylistic/no-extra-semi': ['error'],
      'stylistic/no-mixed-spaces-and-tabs': ['error'],
      'stylistic/no-multi-spaces': ['error'],
      'stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 0 }],
      'stylistic/no-whitespace-before-property': ['error'],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'stylistic/operator-linebreak': ['error', 'before'],
      'stylistic/padded-blocks': ['error', 'never'],
      'stylistic/quotes': ['error', 'single'],
      'stylistic/rest-spread-spacing': ['error', 'never'],
      // 'stylistic/quote-props': ['error', 'always'],
      'stylistic/semi': ['error', 'always'],
      'stylistic/semi-spacing': ['error', { 'before': false, 'after': true }],
      'stylistic/space-before-blocks': ['error', 'always'],
      'stylistic/space-before-function-paren': ['error', 'always'],
      'stylistic/space-in-parens': ['error', 'never'],
      'stylistic/space-infix-ops': ['error'],
      'stylistic/spaced-comment': ['error', 'always'],
      'stylistic/wrap-regex': ['error']
    }
  },
  {
    files: [
      'vite.config.{js,mjs,cjs}',
      'vite/plugins/**/*.js'
    ],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    rules: {
      'css/use-baseline': 'off'
    }
  }
]);

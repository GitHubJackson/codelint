/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/02/27
 * @LastEditTime: 2022/05/15
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-var-requires': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
};

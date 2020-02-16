module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/order': [
      'error',
      {
        groups: [
          ['external', 'builtin'],
          ['internal', 'index', 'sibling', 'parent'],
        ],
      },
    ],
    // TODO: remove
    '@typescript-eslint/ban-ts-ignore': 'warn',
  },
};

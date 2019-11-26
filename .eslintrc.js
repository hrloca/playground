module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-empty-function': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'arrow-parens': 'off',
    'import/extensions': ['off'],
    'no-magic-numbers': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'import/export': 'off',
    'import/no-useless-path-segments': 'error',
    'import/no-cycle': 'error',
    'no-mixed-operators': ['error', { allowSamePrecedence: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  globals: {
  },
}

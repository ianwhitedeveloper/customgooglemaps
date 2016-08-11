'use strict';

let optional = 1;
let required = 2;

module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true
  },
  globals: {
    ENV: true,
    describe: true,
    it: true,
    jQuery: true,
    google: true
  },
  rules: {
    semi: [required, 'always'],
    curly: [required, 'all'],
    quotes: [required, 'single'],
    'object-curly-spacing': [required, 'never'],
    'array-bracket-spacing': [required, 'never'],
    'space-infix-ops': [required, {int32Hint: false}],
    'no-var': required,
    strict: required,
    'no-undef': required,
    'block-scoped-var': required,
    'eol-last': required,
    eqeqeq: [required, 'smart'],
    'max-depth': [optional, 3],
    'max-len': [optional, 80],
    'max-statements': [optional, 15],
    'new-cap': optional,
    'no-extend-native': required,
    'no-multiple-empty-lines': [required, {max: 1, maxBOF: 0}],
    'block-spacing': [required, 'never'],
    'keyword-spacing': required,
    'key-spacing': [required, {afterColon: true}],
    'space-unary-ops': required,
  }
};

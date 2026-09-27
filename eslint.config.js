const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest, // Enables globals like 'test' and 'expect' for when you write tests later
      },
    },
    rules: {
      'indent': ['error', 2],
      // 'unix' vs 'windows' (start from part 5, linebreak change to use 'unix')
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'], // Full Stack Open style defaults to NO semicolons!
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 'warn', // Allows consoles but flags them as warnings
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^next$' }] // Prevents flagging unused 'next' in error handlers
    },
  },
]
module.exports = {
  root: true,

  env: {
    node: true,
    es6: true,
    browser: true,
  },

  extends: ['plugin:vue/essential', 'airbnb-base'],
   plugins: [
     'babel',
     'import',
     'vue',
     'prettier',
   ],

  rules: {
    ignoreTemplateLiterals: true,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: 'off',
    'vue/script-indent': ['warn', 2, {
      baseIndent: 1,
    }],
    'max-len': ['error', {
      code: 400,
      ignorePattern: '^d=.*',
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignoreComments: true,
    }],
    overrides: [{
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'vue/script-indent': ['error', 4, {
          baseIndent: 1,
        }],
      },
    }],

  },
  parser: 'babel-eslint',

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
  },

};

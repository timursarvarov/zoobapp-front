module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/essential', 'airbnb-base'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-unresolved': 'off',
    indent: 'off',
    'vue/script-indent': ['warn', 4, {
      baseIndent: 1,
    }],
    'max-len': ['error', {
      code: 3400,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
    }],
    overrides: [{
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'vue/script-indent': ['error', 4, {
          baseIndent: 4,
        }],
      },
    }],

  },

  parserOptions: {
    parser: 'babel-eslint',
  },

};
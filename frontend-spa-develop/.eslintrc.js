module.exports = {
  plugins: [
    "vue",
    '@typescript-eslint'
  ],
  "parser": "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/strongly-recommended",
  ],
  rules: {
    "no-alert": 0,
    "semi": ["error", 'always'],
    "no-restricted-globals": 0,
    "vue/html-closing-bracket-newline": [2, {"multiline": "never"}],
    "object-curly-newline": 0,
    "lines-between-class-members": 0,
    "class-methods-use-this": 0,
    "indent": [2, 2],
    "guard-for-in": "off",
    "no-restricted-syntax": "warn",
    "comma-dangle": ["error", "never"],
    "max-len": ["warn", { "code": 128, "ignoreRegExpLiterals": true}],
    "space-before-function-paren": 0,
    "key-spacing": 0,
    "object-shorthand": 0,
    "import/no-mutable-exports": 0,
    "no-multi-spaces": 0,
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/v-bind-style": "off",
    "vue/html-self-closing": "off",
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/no-non-null-assertion": 1,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/type-annotation-spacing": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js",".jsx",".ts",".tsx",".vue"]
      }
    }
  }
}

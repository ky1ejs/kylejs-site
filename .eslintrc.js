module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "next",
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "react",
        "prettier"
    ],
    "rules": {
      "prettier/prettier": "error",
      "prefer-const": "error"
    }
};

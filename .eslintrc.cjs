module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    // 1. 'react-refresh/only-export-componnts': Ensure React components are exported properly
    //    Warn because it's important but not necessarily an error
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    
    // 2. '@typescript-eslint/ban-ts-comment': Avoid using @ts-ignore comments
    //    Warn to discourage usage, but doesn't necessarily break the build
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // 3. '@typescript-eslint/no-var-requires': Discourage using require() in favor of ES6 imports
    //    Warn to discourage usage, but doesn't necessarily break the build
    '@typescript-eslint/no-var-requires': 'warn',
    
    // 4. '@typescript-eslint/no-explicit-any': Avoid using explicit 'any' types
    //    Warn to encourage type safety, could be upgraded to 'error' for stricter enforcement
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // 5. '@tanstack/query/exhaustive-deps': Ensure exhaustive dependency arrays in React hooks
    //    Warn to highlight potential issues, but doesn't necessarily break the build
    '@tanstack/query/exhaustive-deps': 'warn',
    
    // 6. '@typescript-eslint/no-unused-vars': Avoid unused variables, enforcing cleaner code
    //    Error to ensure unused variables are caught during linting
    '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_ignored', ignoreRestSiblings: true },
    ],
  },
};
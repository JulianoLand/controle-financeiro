import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    },
    rules: {
      'no-unused-vars': 'warn', // Apenas um aviso para variáveis não usadas
      'no-console': 'off', // Permite console.log sem erro
      'quotes': ['error', 'single'], // Obriga aspas simples e dá erro se usar aspas duplas
      'semi': ['error', 'always'] // Exige ponto e vírgula
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
]);

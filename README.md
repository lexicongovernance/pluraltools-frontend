# Lexicon forum front-end

### PNPM + Vite + React + TS + Styled Components

Naming conventions:

- Folders on kebab-case.

- Components, context on PascalCase.

- Hooks, index and other files on camelCase.

### For developers

1. install [nodejs v20](https://nodejs.org/en/download)
2. install [pnpm](https://pnpm.io/installation#using-npm)
3. start a [backend server](https://github.com/lexicongovernance/forum-backend)
4. create a .env.local from the .env skeleton inside the relevant package, make sure to have the correct VITE_SERVER_URL
5. pnpm i
6. pnpm core:dev or pnpm berlin:dev

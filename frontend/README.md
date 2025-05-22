# kfone-frontend-template - Vite + React + TypeScript

This template provides a minimal setup for `kfone-<module_name>-ui` working in Vite(React) and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Tech Stack Consumed

`frontend` is created using the following technologies:

- ⚡️ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React 18](https://reactjs.org/) - A JavaScript library for building user interfaces
- 🏄 [React Router DOM](https://reactrouter.com/) - A package that enables you to implement dynamic routing in a web app
- 💎 [TypeScript](https://www.typescriptlang.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework that streamlines web development by providing a set of pre-designed utility classes
- 🔨 [EsLint](https://eslint.org/) - Pluggable JavaScript linter
- 🐶 [Husky](https://typicode.github.io/husky/) - Along with Lint Staged — Run scripts on your staged files before they are committed
- 🌀 [Prettier](https://prettier.io) - Opinionated Code Formatter
- 📭 [PostCss](https://postcss.org/) - Supports RTL for specific styles & autoprefixer (add vendor prefixes)
- 🃏 [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — Configured for unit testing
- ⚙️ Proxying API Requests in Development

## Project Hierarchy

- Suggested approach designed for folder arrangement

```
kfone-module-template/
├── .github/
│   ├── variables/
│   │   ├── backend/
│   │   │   └── us-east-1/
│   │   │       └── sb.yaml
│   │   └── frontend/
│   │       └── us-east-1/
│   │           └── sb.env
│   └── workflows/
│       ├── backend-build.yml
│       ├── backend-deploy.yml
│       ├── frontend-build.yml
│       └── frontend-deploy.yml
├── .vscode/
│   └── settings.json
└── frontend/
    ├── .husky/
    │   └── pre-commit
    ├── kfone_config/
    │   └── env/
    │       └── ue/
    │           ├── env.dev.json
    │           └── env.qa1.json
    ├── scripts/
    │   ├── sort-translations.script.js
    ├── src/
    │   ├── assets/
    │   │   ├── images
    │   │   ├── styles
    │   │   ├── fonts
    │   │   └── color-pallete
    │   ├── components/
    │   │   ├── __tests__/
    │   │   │   └── *component-name*/
    │   │   │       └── *component-name.test.tsx*
    │   │   └── __mocks__/
    │   │       └── *component-name*/
    │   │           └── index.ts
    │   ├── containers/
    │   │   ├── __tests__
    │   │   ├── __mocks__
    │   │   └── *container-name.tsx*
    │   ├── exports/
    │   │   ├── __tests__ /
    │   │   │   └── *component-name*/
    │   │   │       └── *index.test.tsx*
    │   │   └── *component-name*/
    │   │       ├── lang-resources.ts
    │   │       └── *index.tsx*
    │   ├── hooks/
    │   │   ├── index.ts
    │   │   └── *useCustom.ts*
    │   ├── model/
    │   │   ├── constants/
    │   │   │   ├── index.ts
    │   │   │   ├── *file-name.ts*
    │   │   │   └── shared.ts
    │   │   ├── enums
    │   │   ├── interfaces
    │   │   └── types
    │   ├── pages/
    │   │   ├── *page-name*/
    │   │   │   ├── sub-routes/
    │   │   │   │   └── *page-name*
    │   │   │   └── index.tsx
    │   │   └── *page-name.tsx*
    │   ├── router/
    │   │   └── index.tsx
    │   ├── services/
    │   │   ├── index.ts
    │   │   └── *module-name.ts*
    │   ├── store/
    │   │   ├── index.ts
    │   │   └── *module-name.ts*
    │   ├── shared/
    │   │   ├── locales/
    │   │   │   ├── en/
    │   │   │   │   └── translation.json
    │   │   │   └── de/
    │   │   │       └── translation.json
    │   │   └── index.ts
    │   ├── utilities
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── .dockerignore
    ├── .env
    ├── .gitignore
    ├── .npmrc
    ├── .prettierignore
    ├── .prettierrc
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── SERVICE.md
    ├── setupTests.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Running kfone-frontend-template

1. npm i
2. npm run build --env=dev [or qa1]
3. npm run preview [for preview mode for MF and custom vite plugins]
4. npm run dev [for normal development]
5. `Optional` To always run in chrome incognito mode & auto-open ui, create `.env` file at root and add below code:

   ```
   BROWSER="chrome"
   BROWSER_ARGS="--incognito --auto-open-devtools-for-tabs"
   ```

6. npm run lint [verify & fix lint issues if any]
7. npm run test:ui [for interactive visualized tests]
8. npm run sort-translations [run only when new keys are added to any translation file]

## Accessing Routes of kfone-frontend-template Repository

1. [localhost:3000](http://localhost:3000) - Home
2. /library - Parent route with sub routes sample\
   2.1 /movies - Example for Tailwind UI, API Integrations\
   2.2 /notification - Example for Notification Toast

## Deployment

- _TBD_ - Additional notes about how to deploy this on a live system.

## Additional Notes

- **Naming Conventions**: `Files` and `directories` are typically named in lowercase with `-` for components (button, shared-layout.tsx) and camelCase for `utilities` and `hooks` (api.ts, useCustomHook.ts).

- **Organization**: Grouping files by functionality (components, containers, exports, hooks, model, pages, router, services, shared, store and utilities) helps keep the project organized and maintainable.

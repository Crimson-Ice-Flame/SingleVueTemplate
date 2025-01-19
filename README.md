# rotki

這個模板應該能幫助你開始使用 Vue 3 和 Vite 進行開發。

## 推薦的 IDE 設置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (並禁用 Vetur)。

## `.vue` 文件在 TS 中的類型支持

TypeScript 無法默認處理 `.vue` 文件的類型信息，因此我們用 `vue-tsc` 替換 `tsc` CLI 進行類型檢查。在編輯器中，我們需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 來使 TypeScript 語言服務器能夠識別 `.vue` 類型。

## 自定義配置

請參閱 [Vite 配置參考](https://vitejs.dev/config/)。

## 專案設置

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

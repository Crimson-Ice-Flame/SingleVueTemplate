import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// ---↓ Plugin 引入 ↓---
import naiveUI from 'naive-ui'
import ElementPlus from 'element-plus';
// ---↑ Plugin 引入 ↑---

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naiveUI)
app.use(ElementPlus)

app.mount('#app')

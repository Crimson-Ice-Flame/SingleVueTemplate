// import './assets/main.css'
import '@/assets/scss/styles.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// ---↓ Plugin 引入 ↓---
import naiveUI from 'naive-ui'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// ---↑ Plugin 引入 ↑---

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naiveUI)
app.use(ElementPlus)

app.mount('#app')

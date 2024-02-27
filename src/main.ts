// import './assets/main.css'
import '@/assets/scss/styles.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// ---↓ Plugin 引入 ↓---
import naiveUI from 'naive-ui'
// import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// ---↑ Plugin 引入 ↑---
import '@/assets/icomoon/style.css';

import directives from '@/directives'; // 引入自定義的 directives

const app = createApp(App)

directives.install(app); // 註冊自定義的 directives
app.use(createPinia())
app.use(router)
app.use(naiveUI)
// app.use(ElementPlus)

app.mount('#app')

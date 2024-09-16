// src/i18n.js
import { createI18n } from 'vue-i18n'
import { en } from './appEn'
import { zh } from './appZh'

// 定義翻譯內容
const messages = {
  en,
  zh
}

// 創建 i18n 實例
const i18n = createI18n({
  locale: 'zh', // 默認語言
  fallbackLocale: 'en', // 回退語言
  messages, // 翻譯內容,
  globalInjection: true
})

export default i18n

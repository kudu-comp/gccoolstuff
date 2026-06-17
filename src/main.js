
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import router from './router'
import store from './store'

// This automatically updates the app when a new version is available
registerSW({ immediate: true })

// Multilanguage support using vue-i18n
import nl from './locales/nl.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: navigator.language.slice(0,2),
  fallbackLocale: 'en',
  missingWarn: false,     // Suppresses "Can't find translation..."
  fallbackWarn: false,    // Suppresses "Fall back to en..."
  messages: {
    en,
    nl
  }
})

// End of i18n block

const app = createApp(App);

app.use(store);
app.use(i18n);
// app.component('vue-navigation-bar', VueNavigationBar);
app.use(router).mount('#app');


import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import store from './store'

import "@/scss/custom.scss"

/* Bootstrap */
// import bootstrap from "bootstrap"

// Multilanguage support using vue-i18n
import nl from './locales/nl.json'
import en from './locales/en.json'

// Navigation bar
import VueNavigationBar from "vue-navigation-bar"
import "./components/css/vue-navigation-bar.css";

// globalInjection: true injects global properties for translation
// Without this we would need to run useI18n in every component to make t() accessible

// $i18n: An object wrapped with the following global scope Composer instance properties
//    locale
//    fallbackLocale
//    availableLocales
// $t: t function of Composer that is global scope
// $d: d function of Composer that is global scope
// $n: n function of Composer that is global scope
// $tm: tm function of Composer that is global scope

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: navigator.language.slice(0,2),
  fallbackLocale: 'en',
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages: {
    en,
    nl
  }
})

// End of i18n block

const app = createApp(App);

app.use(store);
app.use(i18n);
app.component('vue-navigation-bar', VueNavigationBar);
app.use(router).mount('#app');

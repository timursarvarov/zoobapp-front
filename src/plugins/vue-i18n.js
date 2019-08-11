// import Vue from 'vue';
// import VueI18n from 'vue-i18n';

// Vue.use(VueI18n);
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import store from '@/store';

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en: { hello: 'Hello' } },
});

// const loadedLanguages = ['en']; // our default language that is preloaded

// function setI18nLanguage(lang) {
//     i18n.locale = lang;
//     axios.defaults.headers.common['Accept-Language'] = lang;
//     document.querySelector('html').setAttribute('lang', lang);
//     return lang;
// }

// export function loadLanguageAsync(lang) {
//     const local = lang || store.getters.getLang;
//     console.log(local);
//     if (i18n.locale !== local) {
//         if (!loadedLanguages.includes(local)) {
//             return import (`@/lang/${local}.json`).then((msgs) => {
//                 console.log(msgs);
//                 i18n.setLocaleMessage(local, msgs.default);
//                 loadedLanguages.push(local);
//                 return setI18nLanguage(local);
//             }).catch(err => console.log(err));
//         }
//         return Promise.resolve(setI18nLanguage(local));
//     }
//     return Promise.resolve(local || 'en');
// }

/* eslint-disable */
import axios from 'axios';
import { AVAILABLE_LANGUAGES } from '@/constants/';
import i18n from '@/plugins/vue-i18n';
import store from '@/store';

const Trans = {
    get defaultLanguage() {
        return store.getters.getLang;
    },
    get supportedLanguages() {
        return Object.keys(AVAILABLE_LANGUAGES);
    },
    get currentLanguage() {
        return i18n.locale;
    },
    set currentLanguage(lang) {
        i18n.locale = lang;
    },
    /**
     * Gets the first supported language that matches the user's
     * @return {String}
     */
    getUserSupportedLang() {
        const userPreferredLang = Trans.getUserLang();
        // Check if user preferred browser lang is supported
        if (Trans.isLangSupported(userPreferredLang.lang)) {
            return userPreferredLang.lang;
        }
        // Check if user preferred lang without the ISO is supported
        if (Trans.isLangSupported(userPreferredLang.langNoISO)) {
            return userPreferredLang.langNoISO;
        }
        return Trans.defaultLanguage;
    },
    /**
     * Returns the users preferred language
     */
    getUserLang() {
        const lang =
            Trans.defaultLanguage ||
            window.navigator.language ||
            window.navigator.userLanguage
        return {
            lang,
            langNoISO: lang.split('-')[0],
        };
    },
    /**
     * Sets the language to various services (axios, the html tag etc)
     * @param {String} lang
     * @return {String} lang
     */
    setI18nLanguageInServices(lang) {
        Trans.currentLanguage = lang;
        axios.defaults.headers.common['Accept-Language'] = lang;
        document.querySelector('html').setAttribute('lang', lang);
        return lang;
    },
    /**
     * Loads new translation messages and changes the language when finished
     * @param lang
     * @return {Promise<any>}
     */
    changeLanguage(lang) {
        if (!Trans.isLangSupported(lang)) {
            return Promise.reject(new Error('Language not supported'));
        }
        if (i18n.locale === lang) {
            return Promise.resolve(lang).catch((err) => { throw new Error(err); });
        } // has been loaded prior
        return Trans.loadLanguageFile(lang).then((msgs) => {
            i18n.setLocaleMessage(lang, msgs.default || msgs);
            return Trans.setI18nLanguageInServices(lang);
        }).catch((err) => { throw new Error(err); });
    },
    /**
     * Async loads a translation file
     * @param lang
     * @return {Promise<*>|*}
     */
    loadLanguageFile(lang) {
        // eslint-disable-next-line
        return import ( /* webpackChunkName: "lang-[request]" */ `@/lang/${lang}.json`);
    },
    /**
     * Checks if a lang is supported
     * @param {String} lang
     * @return {boolean}
     */
    isLangSupported(lang) {
        return Trans.supportedLanguages.includes(lang);
    },
    /**
     * Checks if the route's param is supported, if not, redirects to the first supported one.
     * @param {Route} to
     * @param {Route} from
     * @param {Function} next
     * @return {*}
     */
    routeMiddleware(to, from, next) {
        // Load async message files here
        const { lang } = to.params;
        if (!Trans.isLangSupported(lang)) return next(Trans.getUserSupportedLang());
        return Trans.changeLanguage(lang).then(() => next());
    },
    /**
     * Returns a new route object that has the current language already defined
     * To be used on pages and components, outside of the main \ route, like on Headers and Footers.
     * @example <router-link :to="$i18nRoute({ name: 'someRoute'})">Click Me </router-link>
     * @param {Object} to - route object to construct
     */
    i18nRoute(to) {
        return {
            ...to,
            params: { lang: this.currentLanguage, ...to.params },
        };
    },
};

// eslint-disable-next-line import/prefer-default-export
export { Trans };

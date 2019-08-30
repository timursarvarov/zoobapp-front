<template>
    <li class="md-list-item">
        <a class="md-list-item-router md-list-item-container md-button-clean dropdown">
            <div class="md-list-item-content">
                <drop-down direction="down">
                    <md-button
                        slot="title"
                        class="md-simple dropdown-togglec md-just-icon md-list-item-content"
                        data-toggle="dropdown"
                    >
                        <md-icon>
                            <img :src="require(`@/assets/images/flags/${$i18n.locale}.png`)">
                        </md-icon>
                        <p class="hidden-lg hidden-md">{{ languagesAttrs[$i18n.locale].name }}</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li
                            v-for="(lang) in supportedLanguages"
                            v-show="lang!==$i18n.locale"
                            :key="lang"
                            :class="[{'selected-menu-top-navbar': $i18n.locale === lang }]"
                            @click="changeLanguage(lang)"
                        >
                            <a :style="{color: $i18n.locale === lang ? '#fff!important': ''}">
                                <img
                                    style="margin-right:10px"
                                    :src="require(`@/assets/images/flags/${lang}.png`)"
                                >
                                {{ languagesAttrs[lang].name }}
                            </a>
                        </li>
                    </ul>
                </drop-down>
            </div>
        </a>
    </li>
</template>
<script>
import { mapGetters } from 'vuex';
import { Trans } from '@/plugins/translation';
import { AVAILABLE_LANGUAGES, LOCAL_STORAGE, USER_UPDATE } from '@/constants';

export default {
    computed: {
        ...mapGetters({
            isProfileLoaded: 'isProfileLoaded',
        }),
        supportedLanguages() {
            return Trans.supportedLanguages;
        },
        currentLanguage() {
            return Trans.currentLanguage;
        },
        languagesAttrs() {
            return AVAILABLE_LANGUAGES;
        },
    },
    methods: {
        changeLanguage(lang) {
            const to = this.$router.resolve({ params: { lang } });
            if (this.isProfileLoaded) {
                this.$store
                    .dispatch(USER_UPDATE, {
                        user: {
                            lang,
                        },
                    })
                    .then((user) => {
                        localStorage.setItem(LOCAL_STORAGE.user.lang, lang);
                        return Trans.changeLanguage(user.lang);
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            }
            return Trans.changeLanguage(lang)
                .then(() => {
                    localStorage.setItem(LOCAL_STORAGE.undefinedUser.lang, lang);
                    this.$router.push(to.location);
                })
                .catch((err) => {
                    throw new Error(err);
                });
        },
        isCurrentLanguage(lang) {
            return lang === this.currentLanguage;
        },
    },
};
</script>

<style>
.LanguageSwitcher {
    margin-bottom: 1rem;
}
</style>

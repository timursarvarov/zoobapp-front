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
                            <img
                                :src="`./assets/images/flags/${$i18n.locale}.png`"
                            />
                        </md-icon>
                        <p class="hidden-lg hidden-md">{{languagesAttrs[$i18n.locale].name}}</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li
                            v-for="(lang) in supportedLanguages"
                            v-show="lang!==$i18n.locale"
                            :key="lang"
                            @click="changeLanguage(lang)"
                            :class="[{'selected-menu-top-navbar': $i18n.locale === lang }]"
                        >
                            <a :style="{color:  $i18n.locale === lang ? '#fff!important': ''}">
                                <img
                                    style="margin-right:10px"
                                    :src="`./assets/images/flags/${lang}.png`"
                                />
                                {{languagesAttrs[lang].name}}
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
    import {
        AVAILABLE_LANGUAGES,
        LOCAL_STORAGE,
        USER_UPDATE,
    } from '@/constants';

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
                    console.log(lang);
                    this.$store.dispatch(USER_UPDATE, {
                        user: {
                            lang,
                        },
                    }).then((user) => {
                        Trans.changeLanguage(user.lang);
                        this.$router.push(to.location);
                        localStorage.setItem(LOCAL_STORAGE.user.lang, lang);
                    }).catch((err) => { console.log(err); });
                }
                return Trans.changeLanguage(lang).then(() => {
                    this.$router.push(to.location);
                    localStorage.setItem(LOCAL_STORAGE.undefinedUser.lang, lang);
                }).catch((err) => { console.log(err); });
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

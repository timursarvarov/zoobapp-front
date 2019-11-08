<template>
    <div>
        <router-view />
        <notifications />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AVAILABLE_LANGUAGES, AUTH_REFRESH_TOKEN, COMMON_CURRENCY } from '@/constants';
import { Trans } from '@/plugins/translation';

const observer = new PerformanceObserver(list => {
    console.log('Long Task detected! 🚩️');
    const entries = list.getEntries();
    console.log(entries);
});

export default {
    name: 'App',
    computed: {
        ...mapGetters({
            getNotify: 'getNotify',
            refreshTokenExist: 'fetchStateRefreshToken',
            isProfileLoaded: 'isProfileLoaded',
            lang: 'getLang',
            user: 'getProfile',
            currentClinic: 'getCurrentClinic',
            currency: 'getCurrency'
        }),

        languages() {
            return AVAILABLE_LANGUAGES;
        },
        i18nLang() {
            return this.$i18n.locale;
        }
    },
    watch: {
        getNotify: {
            handler: function(newValue, oldValue) {
                if (newValue.notify !== oldValue.notify) {
                    const newNotify = {};
                    const el = this;
                    Object.keys(el.getNotify).forEach(key => {
                        newNotify[key] = el.getNotify[key];
                    });
                    this.$notify(newNotify);
                }
            },
            deep: true
        },
        isProfileLoaded(value) {
            if (!value && this.$route.meta && this.$route.meta.requiresAuth) {
                this.$router.push({
                    name: 'login',
                    params: {
                        lang: this.$i18n.locale
                    }
                });
            }
        },
        i18nLang() {
            this.setMomentLang(Trans.getUserSupportedLang());
        }
    },
    mounted() {
        if (this.refreshTokenExist) {
            this.$store
                .dispatch(AUTH_REFRESH_TOKEN)
                .then( () => {
                    this.setGlobalCurrencyFilter()
                })
                .catch(err => {
                    console.log(err);
                    if (this.$route.name !== 'login') {
                        this.$router.push({ name: 'login', params: { lang: Trans.getUserSupportedLang() } });
                    }
                });
        } else if (this.$route.name !== 'login') {
            this.$router.push({ name: 'login', params: { lang: Trans.getUserSupportedLang() } });
        }
        this.setMomentLang(this.$i18n.locale);
    },
    methods: {
        setGlobalCurrencyFilter() {
            const currencySettings = {
                symbol: this.currency || '£',
                thousandsSeparator: this.currentClinic.thousandsSeparator ||',',
                fractionCount: this.currentClinic.fractionCount || 2,
                fractionSeparator: this.currentClinic.fractionSeparator || '.',
                symbolPosition: this.currentClinic.symbolPosition || 'front',
                symbolSpacing: this.currentClinic.symbolSpacing !== undefined ? this.currentClinic.symbolSpacing : true
            };
            console.log(this.currentClinic)
            this.$CurrencyFilter.setConfig(currencySettings);
        },
        setMomentLang(val) {
            if (val && val != 'en-US') {
                if (val && val != 'en') {
                    if (val === 'uz') {
                        let newVal = 'uz-latn';
                        let trLocale = require(`moment/locale/${newVal}`);
                        this.$moment.updateLocale(newVal, trLocale);
                    } else {
                        let trLocale = require(`moment/locale/${val}`);
                        this.$moment.updateLocale(val, trLocale);
                    }
                } else if (val) {
                    this.$moment.locale(val);
                }
            }
        }
    }
};
</script>
<style lang="scss" src="./assets/scss/main/main.scss">
[v-cloak] {
    display: block;
    padding: 50px 0;

    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    &:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 50%;
        border: 2px solid #ccc;
        border-top-color: #333;
        animation: spinner .6s linear infinite;
        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
    }

    & > div {
        display: none;
    }
}
    .md-menu-content {
        z-index: 15 !important;
        min-width: 300px;
    }
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                              supported by Chrome and Opera */
    }

    .md-table-cell {
        .md-table-cell-container > div {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }
    }
    .md-tabs-navigation {
        overflow: auto;
    }
    div :not(.md-toolbar) > .md-field:not(.md-chips):not(.no-margin) {
        margin-top: 24px;
        .md-error {
            position: absolute;
            display: block !important;
            opacity: 1;
            // transform: translate3d(0,-12px,0);
            color: #ff1744;
            font-size: 0.6875rem;
            bottom: -1.3rem;
            line-height: normal;
            text-align: left;
        }
        .md-input-action {
            margin: 0;
        }
    }
    // .md-button,
    // .md-button.md-default {
    //   box-shadow: none;
    // }
    .clear-button {
        width: 28px !important;
        min-width: 28px !important;
        height: 28px !important;
        margin: 0;
        position: absolute !important;
        background-color: transparent !important;
        -webkit-box-shadow: none;
        box-shadow: none;
        top: 6px !important;
        .md-button-content {
            top: -13px;
            left: 13px;
        }
    }
    textarea::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }
    textarea::-webkit-scrollbar-thumb {
        background-color: grey;
        border-radius: 5px;
    }
    /* .md-field .md-input-action { */
    /* background-color: transparent !important; */
    /* } */
    .main-panel > .content {
        min-height: calc(100vh - 160px);
    }
    .md-dialog {
        box-shadow: none;
    }
    .md-chips:before,
    .md-chips:after {
        display: block;
    }
    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                              supported by Chrome and Opera */
    }
}
</style>
>

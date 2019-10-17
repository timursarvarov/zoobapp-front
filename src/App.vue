/* eslint-disable */
<template>
    <div>
        <router-view />
        <notifications />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AUTH_INIT, AVAILABLE_LANGUAGES } from '@/constants';

export default {
    name: 'App',
    computed: {
        ...mapGetters({
            getNotify: 'getNotify',
            refreshTokenExist: 'fetchStateRefreshToken',
            isProfileLoaded: 'isProfileLoaded',
            lang: 'getLang'
        }),
        languages() {
            return AVAILABLE_LANGUAGES;
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
        lang(val) {
            if (val && val != 'en') {
                if (val === 'uz') {
                    let newVal = 'uz-latn';
                    let trLocale = require(`moment/locale/${newVal}`);
                    this.$moment.updateLocale(newVal, trLocale);
                } else {
                    let trLocale = require(`moment/locale/${val}`);
                    this.$moment.updateLocale(val, trLocale);
                }
            } else {
                this.$moment.locale(val);
            }
        }
    },
    mounted() {
        if (this.refreshTokenExist) {
            this.$store.dispatch(AUTH_INIT);
        } else {
            this.$router.push({ name: 'login', params: { lang: this.lang } });
        }
        this.$moment.locale(this.lang);
    }
};
</script>
<style lang="scss" src="./assets/scss/main/main.scss">
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
</style>
>

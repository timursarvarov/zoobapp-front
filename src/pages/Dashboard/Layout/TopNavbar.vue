<template>
    <md-toolbar
        md-elevation="0"
        class="md-transparent top-navbar-wrapper"
        :class="{
            'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute
        }"
    >
        <div class="the-main-progress-bar">
            <md-progress-bar v-show="loading" :md-stroke="2" md-mode="indeterminate" />
        </div>
        <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">
                    <small
                        v-if="$route.params.patientID && (lastPatient.firstName || lastPatient.lastName)"
                        class="md-layout md-alignment-left-center"
                    >
                        <avatar-box
                            v-if="$route.params.patientID && (lastPatient.firstName || lastPatient.lastName)"
                            :avatar="lastPatient.avatar"
                            :id="lastPatient.ID"
                            :firstLine="`${lastPatient.firstName} ${lastPatient.lastName}`"
                            :notificationClass="lastPatient.allergy ? 'warning' : ''"
                            :notification="!lodash.isEmpty(lastPatient.allergy) ? 'A' : ''"
                        />
                    </small>
                    <small v-if="$route.params.patientID && (lastPatient.firstName || lastPatient.lastName)">></small>
                    <small class="md-layout-item">{{ $t(`Routes.${$route.name}`) }}</small>
                </h3>
            </div>
            <div class="md-toolbar-section-end">
                <md-button
                    class="md-just-icon md-round md-round md-simple md-toolbar-toggle"
                    :class="{ toggled: $sidebar.showSidebar }"
                    @click="toggleSidebar"
                >
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                    <span class="icon-bar" />
                </md-button>
                <div class="md-collapse">
                    <t-cool-select-patient-search />
                    <md-list>
                        <li class="md-list-item">
                            <a class="md-list-item-router md-list-item-container md-button-clean" @click="goTo('/')">
                                <div v-ripple class="md-list-item-content">
                                    <i class="material-icons">dashboard</i>
                                    <p class="hidden-lg hidden-md">
                                        {{ $t(`Routes.Dashboard`) }}
                                    </p>
                                </div>
                            </a>
                        </li>
                        <li class="md-list-item">
                            <a class="md-list-item-router md-list-item-container md-button-clean" @click="showPatientAddForm()">
                                <div v-ripple class="md-list-item-content">
                                    <i class="material-icons">person_add</i>
                                    <p class="hidden-lg hidden-md">
                                        {{ $t(`${$options.name}.addPatient`) }}
                                    </p>
                                </div>
                            </a>
                        </li>
                        <li class="md-list-item">
                            <a class="md-list-item-router md-list-item-container md-button-clean dropdown">
                                <div class="md-list-item-content">
                                    <drop-down direction="down">
                                        <md-button slot="title" class="md-button md-just-icon md-simple" data-toggle="dropdown">
                                            <md-icon>notifications</md-icon>
                                            <span class="notification">5</span>
                                            <p class="hidden-lg hidden-md">
                                                {{ $t(`${$options.name}.notifications`) }}
                                            </p>
                                        </md-button>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                            <li class="md-layout">
                                                <a href="#" class="md-layout">Mike John responded to your email</a>
                                            </li>
                                            <li class="md-layout">
                                                <a href="#" class="md-layout">You have 5 new tasks</a>
                                            </li>
                                            <li class="md-layout">
                                                <a href="#" class="md-layout">You're now friend with Andrew</a>
                                            </li>
                                            <li class="md-layout">
                                                <a href="#" class="md-layout">Another Notification</a>
                                            </li>
                                            <li class="md-layout">
                                                <a href="#" class="md-layout">Another One</a>
                                            </li>
                                        </ul>
                                    </drop-down>
                                </div>
                            </a>
                        </li>
                        <t-language-switcher />
                        <li class="md-list-item">
                            <a class="md-list-item-router md-list-item-container md-button-clean dropdown">
                                <div class="md-list-item-content">
                                    <drop-down multi-level direction="down">
                                        <md-button slot="title" class="md-button md-round md-just-icon md-simple" data-toggle="dropdown">
                                            <md-icon>more_vert</md-icon>
                                            <p class="hidden-lg hidden-md">
                                                {{ $t(`${$options.name}.more`) }}
                                            </p>
                                        </md-button>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                            <li class="md-layout">
                                                <router-link tag="a" to="/pages/user" class="md-layout-item">
                                                    <t-avatar
                                                        small
                                                        :text-to-color="user.ID"
                                                        :no-img-tag="true"
                                                        :image-src="user.avatar"
                                                        :title="user.firstName + ' ' + user.lastName"
                                                    />
                                                    {{ $t(`${$options.name}.myProfile`) }}
                                                </router-link>
                                            </li>
                                            <li class="md-layout" @click="showPatientAddForm()">
                                                <a href="#" class="md-layout">
                                                    <md-icon>person_add</md-icon>
                                                    {{ $t(`${$options.name}.addPatient`) }}
                                                </a>
                                            </li>
                                            <li class="md-layout" @click="lock()">
                                                <a href="#" class="md-layout">
                                                    <md-icon>lock</md-icon>
                                                    {{ $t(`${$options.name}.lock`) }}
                                                </a>
                                            </li>
                                            <li class="md-layout" @click="logout()">
                                                <a href="#" class="md-layout">
                                                    <md-icon>arrow_back</md-icon>
                                                    {{ $t(`${$options.name}.logout`) }}
                                                </a>
                                            </li>
                                            <li class="md-layout">
                                                <a
                                                    :class="[
                                                        { open: multiLevel },
                                                        {
                                                            'dropdown-toggle': clinics && clinics.length > 1
                                                        }
                                                    ]"
                                                    class="md-layout"
                                                    @click="toggleMultiLevel"
                                                >
                                                    <img
                                                        style="margin-right:10px; height:24px; width:24px; border-radius:50%"
                                                        :src="currnentClinic.logo"
                                                    />
                                                    {{ currnentClinic.name }}
                                                    {{ currnentClinic.id }}
                                                </a>
                                                <ul v-if="clinics && clinics.length > 1" class="dropdown-menu">
                                                    <li
                                                        v-for="(clinic, index) in clinics"
                                                        :key="index"
                                                        :class="[
                                                            {
                                                                'selected-menu-top-navbar': clinic.ID === currnentClinic.ID
                                                            }
                                                        ]"
                                                        @click="setClinic(clinic.ID), toggleMultiLevel()"
                                                    >
                                                        <a
                                                            :style="{
                                                                color: clinic.ID === currnentClinic.ID ? '#fff!important' : ''
                                                            }"
                                                            class="md-layout"
                                                            href="#"
                                                        >
                                                            <img
                                                                style="margin-right:10px; height:24px; width:24px; border-radius:50%"
                                                                :src="clinic.logo"
                                                            />
                                                            {{ clinic.name | capitilize }}{{ clinic.ID }}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </drop-down>
                                </div>
                            </a>
                        </li>
                    </md-list>
                </div>
            </div>
        </div>
    </md-toolbar>
</template>

<script>
import { mapGetters } from 'vuex';
import components from '@/components';
import { CLINIC_AUTH_REQUEST, AUTH_LOGOUT, AUTH_LOCK, NOTIFY } from '@/constants';

export default {
    components: {
        ...components
    },
    name: 'TopNavBar',
    data() {
        return {
            totalPatients: 0,
            callbackLauncher: null,
            infiniteId: 1,
            searchText: '',
            searchTerm: '',
            patients: [],
            coolSelectFocus: false,
            serverError: false,
            searching: false,
            multiLevel: false,
            noData: false,
            perPage: 20,
            page: 1
            // lastPatient: {}
        };
    },
    computed: {
        ...mapGetters({
            loading: 'loading',
            lastPatient: 'getLastPatient',
            clinics: 'getClinics',
            user: 'getProfile',
            currnentClinic: 'getCurrentClinic',
            accessToken: 'fetchStateAccessToken',
            expiresAt: 'expiresAt',
            lang: 'getLang'
        })
    },
    methods: {
        goTo(route) {
            this.$router.push(route);
        },
        setClinic(clinicId) {
            this.$store
                .dispatch(CLINIC_AUTH_REQUEST, {
                    clinicId,
                    accessToken: this.accessToken
                })
                .then(
                    // eslint-disable-next-line no-unused-vars
                    response => {
                        this.$router.push('/');
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Clinic changed',
                                type: 'success',
                                icon: 'domain'
                            }
                        });
                    },
                    error => {
                        if (error && error.response) {
                            if (error.response.data.message === 'Wrong password') {
                                this.showErrorsValidate('password');
                            }
                            if (error.response.data.message === 'Invalid login') {
                                this.showErrorsValidate('username');
                            }
                        }
                    }
                );
        },
        toggleMultiLevel() {
            this.multiLevel = !this.multiLevel;
        },
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        showPatientAddForm() {
            this.$patientAddForm.showPatientAddForm(true);
        },
        minimizeSidebar() {
            if (this.$sidebar) {
                this.$sidebar.toggleMinimize();
            }
        },
        logout() {
            this.$store.dispatch(AUTH_LOGOUT).then(() => {});
        },
        lock() {
            this.$store.dispatch(AUTH_LOCK).then(() => {
                this.$router.push('lock');
            });
        }
    }
};
</script>

<style lang="scss">
.selected-menu-top-navbar {
    a {
        background-color: #9c27b0;
        color: white !important;
    }
}
.lastPatient-header-avatar {
    width: 40px;
}
.wrapper-progress-bar {
    position: fixed;
    top: 1px;
    right: 0;
    width: 100%;
    height: 5px;
}
.the-main-progress-bar {
    position: fixed;
    top: 1px;
    right: 0;
    width: 100%;
    height: 5px;
    .md-progress-bar {
        left: 0;
        top: 1px;
        position: absolute;
        right: 0;
        width: 100vw;
    }
}
.patient_header_title {
    overflow: hidden;
    text-overflow: ellipsis;
}

.search {
    min-width: 250px;
    width: 20vh;
    margin: 0 !important;
}
.for-loader {
    height: 40px;
}
.md-serched-list-item-text {
    position: relative !important;
    white-space: nowrap;
    padding: 0 6px !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
.search-avatar {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
}
</style>

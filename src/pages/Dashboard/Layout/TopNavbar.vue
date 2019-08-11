<template>
    <md-toolbar
        md-elevation="0"
        class="md-transparent top-navbar-wrapper"
        :class="{'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute}"
    >
        <div class="wrapper-progress-bar">
            <!-- <md-progress-bar
                v-if="loading"
                :md-stroke="2"
            md-mode="indeterminate"></md-progress-bar>-->
        </div>
        <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">
                    <template
                        class="md-layout md-alignment-left-center"
                        v-if="$route.name === 'PatientTreatmentent' && (patient.firstName || patient.secondName) "
                    >
                        <t-avatar
                            class="patient-header-avatar"
                            :textToColor="patient.ID"
                            :imageSrc="patient.avatar"
                            :title="patient.firstName + ' ' + patient.lastName"
                        />
                        <span class="patient_header_title md-layout-item">
                            {{ `${patient.firstName }` | capitilize }}
                            {{ `${patient.lastName }` | capitilize }}
                        </span>
                        <md-button
                            @click="handleAllergy(patient.allergy)"
                            v-if="patient.allergy &&  patient.allergy.length>0"
                            class="md-icon-button md-simple md-danger md-round md-just-icon"
                        >
                            <md-icon>report_problem</md-icon>
                            <md-tooltip>Attention allergy!</md-tooltip>
                        </md-button>
                    </template>
                    <span v-else>{{$route.name}}</span>
                </h3>
            </div>
            <div class="md-toolbar-section-end">
                <md-button
                    class="md-just-icon md-round md-round md-simple md-toolbar-toggle"
                    :class="{toggled: $sidebar.showSidebar}"
                    @click="toggleSidebar"
                >
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </md-button>
                <div class="md-collapse">
                    <cool-select
                        class="patient-select with-action md-field"
                        :class="[
                        {'md-focused': coolSelectFocus || searchTerm},
                        {'no-after-no-before': searching}
                        ]"
                        style="width:300px;"
                        @focus="coolSelectFocus = true"
                        @blur="coolSelectFocus = false"
                        tabindex="0"
                        v-model="searchTerm"
                        :searchText.sync="searchText"
                        :items="patients"
                        :loading="searching"
                        item-text="firstName"
                        disable-filtering-by-search
                        loadingIndicator="spinner"
                        :arrowsDisableInstantSelection="true"
                        :disableFirstItemSelectOnEnter="true"
                        @select="goToPatient"
                        @search="getPatients"
                    >
                        <template slot="input-end">
                            <md-button
                                @click=" searchTerm=null"
                                tabindex="-1"
                                v-show="searchTerm"
                                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                            >
                                <md-icon class="success">close</md-icon>
                            </md-button>
                        </template>
                        <template slot="input-start">
                            <label for="input">Search for patient</label>
                        </template>
                        <template slot="input-after">
                            <md-progress-bar
                                v-if="searching"
                                class="underline-progress-bar"
                                :md-stroke="2"
                                md-mode="indeterminate"
                            ></md-progress-bar>
                        </template>
                        <template slot="no-data">
                            <div v-if="!serverError && ( searchText.length<3)">
                                <div class="md-layout">
                                    <div>
                                        <md-subheader
                                            class="text-center"
                                        >Type at least 3 letters to search by phone, email or name</md-subheader>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="noData">
                                <div class="md-layout">
                                    <div
                                        class="md-size-100 md-layout md-alignment-center-center"
                                        style="white-space: pre-wrap;oveflow:hidden; padding: 0 0 15px 0;"
                                    >
                                        <span
                                            class="md-layout-item"
                                        >No patients matching "{{ searchText }}" were found.</span>
                                    </div>
                                    <div
                                        class="md-layout md-layout-item md-alignment-center md-size-100"
                                    >
                                        <md-button
                                            class="md-success md-sm"
                                            @click="showPatientAddForm()"
                                        >Create patient</md-button>
                                    </div>
                                </div>
                            </div>

                            <div v-else-if="serverError">
                                <md-subheader class="text-center">Connection problems</md-subheader>

                                <md-button
                                    class="md-success md-layout-item md-sm"
                                    @click="getPatients()"
                                >Retry</md-button>
                            </div>
                        </template>
                        <template v-if="item" slot="item" slot-scope="{ item }">
                            <div style="display: flex;">
                                <md-button class="IZ-select-button btn-avatar">
                                    <t-avatar
                                        class="search-avatar"
                                        :textToColor="item.ID"
                                        :imageSrc="item.avatar"
                                        :title="item.firstName + ' ' + item.lastName"
                                        :notification="item.allergy && item.allergy.length ? 'A' : ''"
                                    />
                                    <div class="md-serched-list-item-text text-left">
                                        <span>
                                            {{ item.firstName | capitilize}} {{ item.lastName | capitilize }}
                                            <br />
                                        </span>
                                        <span v-if="item.phone">{{ "+" + item.phone }}</span>
                                    </div>
                                </md-button>
                            </div>
                        </template>
                        <template v-if="patients ? patients.length >1 : false" slot="after-items">
                            <div style="display: flex;">
                                <div style="flex-grow:1" class="md-layout-item">
                                    <infinite-loading
                                        @infinite="infiniteHandler"
                                        :identifier="infiniteId"
                                        :key="patients ? patients.length: 0"
                                    >
                                        <div slot="spinner">
                                            <md-progress-spinner
                                                :md-diameter="40"
                                                :md-stroke="4"
                                                md-mode="indeterminate"
                                            />
                                        </div>
                                        <div slot="no-results">
                                            <div class="md-title text-center">No more patients</div>
                                        </div>
                                        <div slot="error" slot-scope="{ trigger }">
                                            <div class="md-layout">
                                                <div
                                                    class="md-layout-item"
                                                    style="padding: 15px 0;"
                                                >
                                                    <md-subheader
                                                        class="text-center"
                                                    >Oops! Connection problems</md-subheader>
                                                    <div class="md-layout-item md-size-100">
                                                        <md-button
                                                            class="md-primary md-layout-item mx-auto md-sm"
                                                            @click="trigger"
                                                        >Retry</md-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </infinite-loading>
                                </div>
                            </div>
                        </template>
                        <template v-if="totalPatients" slot="after-items-fixed">
                            <div style="display: flex;">
                                <div style="flex-grow:1" class="md-layout-item">
                                    <md-subheader
                                        class="text-center"
                                    >Total found: {{totalPatients}} patients</md-subheader>
                                </div>
                            </div>
                        </template>
                    </cool-select>
                    <md-list>
                        <md-list-item>
                            <router-link to="/">
                                <i class="material-icons">dashboard</i>
                                <p class="hidden-lg hidden-md">Dashboard</p>
                            </router-link>
                        </md-list-item>
                        <md-list-item
                            class="md-primary md-round md-simple md-just-icon"
                            @click="showPatientAddForm()"
                        >
                            <i class="material-icons">person_add</i>
                            <p class="hidden-lg hidden-md">Add Patient</p>
                        </md-list-item>

                        <li class="md-list-item">
                            <a
                                class="md-list-item-router md-list-item-container md-button-clean dropdown"
                            >
                                <div class="md-list-item-content">
                                    <drop-down direction="down">
                                        <md-button
                                            slot="title"
                                            class="md-button md-round md-just-icon md-simple"
                                            data-toggle="dropdown"
                                        >
                                            <md-icon>notifications</md-icon>
                                            <span class="notification">5</span>
                                            <p class="hidden-lg hidden-md">Notifications</p>
                                        </md-button>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                            <li>
                                                <a href="#">Mike John responded to your email</a>
                                            </li>
                                            <li>
                                                <a href="#">You have 5 new tasks</a>
                                            </li>
                                            <li>
                                                <a href="#">You're now friend with Andrew</a>
                                            </li>
                                            <li>
                                                <a href="#">Another Notification</a>
                                            </li>
                                            <li>
                                                <a href="#">Another One</a>
                                            </li>
                                        </ul>
                                    </drop-down>
                                </div>
                            </a>
                        </li>
                        <li class="md-list-item">
                            <a
                                class="md-list-item-router md-list-item-container md-button-clean dropdown"
                            >
                                <div class="md-list-item-content">
                                    <drop-down multiLevel direction="down">
                                        <md-button
                                            slot="title"
                                            class="md-button md-round md-just-icon md-simple"
                                            data-toggle="dropdown"
                                        >
                                            <md-icon>more_vert</md-icon>
                                            <p class="hidden-lg hidden-md">More</p>
                                        </md-button>
                                        <ul class="dropdown-menu dropdown-menu-right">
                                            <li>
                                                <router-link tag="a" to="/pages/user">My Profile</router-link>
                                            </li>
                                            <li @click="showPatientAddForm()" class="md-layout">
                                                <a href="#" class="md-layout-item">Add new Patient</a>
                                            </li>
                                            <li @click="lock()" class="md-layout">
                                                <a href="#" class="md-layout-item">Lock</a>
                                            </li>
                                            <li @click="logout()">
                                                <a href="#">Logout</a>
                                            </li>
                                            <li>
                                                <a
                                                    :class="{'open': multiLevel1}"
                                                    @click="multiLevel1 = !multiLevel1"
                                                    class="dropdown-toggle"
                                                >
                                                    <img
                                                        style="margin-right:10px"
                                                        :src="`./assets/images/flags/${$i18n.locale}.png`"
                                                    />
                                                    {{languages[$i18n.locale].name}}
                                                </a>
                                                <ul class="dropdown-menu">
                                                    <li
                                                        v-for="(lang, key) in languages"
                                                        v-show="lang.code!==$i18n.locale"
                                                        :key="key"
                                                        @click=" setLanguage(lang.code)"
                                                        :class="[{'selected-menu-top-navbar': $i18n.locale === lang.code }]"
                                                    >
                                                        <a
                                                            @click="multiLevel1 = !multiLevel1"
                                                            :style="{color:  $i18n.locale === lang.code ? '#fff!important': ''}"
                                                        >
                                                            <img
                                                                style="margin-right:10px"
                                                                :src="`./assets/images/flags/${lang.code}.png`"
                                                            />
                                                            {{languages[lang.code].name}}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li >
                                                <a
                                                    :class="
                                                    [
                                                        {'open': multiLevel},
                                                        {'dropdown-toggle': clinics && clinics.length > 1},
                                                    ]"
                                                    @click="toggleMultiLevel"
                                                >    <img
                                                        style="margin-right:10px; height:24px; width:24px; border-radius:50%"
                                                        :src="currnentClinic.logo"
                                                    />
                                                    {{currnentClinic.name}}
                                                    {{currnentClinic.id}}
                                                </a>
                                                <ul v-if="clinics && clinics.length > 1"
                                                    class="dropdown-menu">
                                                    <li
                                                        @click="setClinic(clinic.ID), toggleMultiLevel()"
                                                        :class="[{'selected-menu-top-navbar': clinic.ID === currnentClinic.ID }]"
                                                        v-for="(clinic, index) in clinics"
                                                        :key="index"
                                                    >
                                                        <a
                                                            :style="{color: clinic.ID === currnentClinic.ID ? '#fff!important': ''}"
                                                            href="#"
                                                        >
                                                            <img
                                                                style="margin-right:10px; height:24px; width:24px; border-radius:50%"
                                                                :src="clinic.logo"
                                                            />
                                                            {{clinic.name | capitilize }}{{clinic.ID }}</a>
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
/* eslint-disable */
import {
    CLINIC_AUTH_REQUEST,
    AUTH_LOGOUT,
    PATIENTS_REQUEST,
    AUTH_LOCK,
    NOTIFY,
    AVAILABLE_LANGUAGES,
    LOCAL_STORAGE,
    USER_UPDATE,

} from "@/constants";
import { mapGetters } from "vuex";
import components from "@/components";
import { CoolSelect } from "vue-cool-select";
import InfiniteLoading from "vue-infinite-loading";

export default {
    components: {
        ...components,
        CoolSelect,
        InfiniteLoading
    },
    data() {
        return {
            totalPatients: 0,
            callbackLauncher: null,
            infiniteId: 1,
            searchText: "",
            searchTerm: "",
            patients: [],
            coolSelectFocus: false,
            serverError: false,
            searching: false,
            multiLevel: false,
            multiLevel1: false,
            noData: false,
            perPage: 20,
            page: 1
        };
    },
    methods: {
        setLanguage(lang) {
             localStorage.setItem(LOCAL_STORAGE.undefinedUser.lang, lang);
                this.$i18n.locale = lang;
                const route = Object.assign({}, this.$route);
                route.params.lang = lang;
                this.$router.push(route);
                this.$i18n.lang = lang;
                this.$store.dispatch(USER_UPDATE, {
                    user: {
                        lang: lang.backendCode,
                    },
                });
        },
        setClinic(clinicId) {
            this.$store
                .dispatch(CLINIC_AUTH_REQUEST, {
                    clinicId: clinicId,
                    accessToken: this.accessToken
                })
                .then(
                    // eslint-disable-next-line no-unused-vars
                    response => {
                        this.$router.push("/");
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: "Clinic changed",
                                type: "success",
                                icon: "domain"
                            }
                        });
                    },
                    error => {
                        if (error && error.response) {
                            if (
                                error.response.data.message === "Wrong password"
                            ) {
                                this.showErrorsValidate("password");
                            }
                            if (
                                error.response.data.message === "Invalid login"
                            ) {
                                this.showErrorsValidate("username");
                            }
                        }
                    }
                );
        },
        toggleMultiLevel() {
            this.multiLevel = !this.multiLevel;
        },
        goToPatient(patient) {
            if (patient) {
                this.$router.push({
                    name: "PatientTreatmentent",
                    params: { patientId: patient.ID }
                });
            }
        },
        infiniteHandler($state) {
            this.page += 1;
            this.$store
                .dispatch(PATIENTS_REQUEST, {
                    params: {
                        perPage: this.perPage,
                        page: this.page,
                        search: this.searchText,
                        toStore: false
                    }
                })
                .then(resp => {
                    if (resp) {
                        console.log(resp);
                        if (!resp.patients) {
                            $state.complete();
                        } else if (resp.patients.length < this.perPage) {
                            $state.complete();
                        } else {
                            $state.loaded();
                        }
                        if (resp.patients) {
                            this.patients.push(...resp.patients);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    $state.error();
                })
                .then(() => {
                    this.searching = false;
                });
        },
        getPatients() {
            this.lastSearchItem = this.searchText;
            const promise = new Promise((resolve, reject) => {
                if (!this.searchText || this.searchText.length < 3) {
                    resolve([]);
                } else {
                    this.noData = false;
                    this.serverError = false;
                    this.searching = true;
                    const vm = this;
                    const DELAY = 400;
                    if (vm.callbackLauncher) {
                        clearTimeout(vm.callbackLauncher);
                    }
                    this.page = 1;
                    this.infiniteId = +1;
                    vm.patients = [];
                    this.callbackLauncher = setTimeout(() => {
                        resolve(
                            vm.$store
                                .dispatch(PATIENTS_REQUEST, {
                                    params: {
                                        perPage: vm.perPage,
                                        page: vm.page,
                                        search: vm.searchText,
                                        toStore: false
                                    }
                                })
                                .then(resp => {
                                    if (resp.patients) {
                                        if (resp.patients.length === 0) {
                                            vm.noData = true;
                                        }
                                        vm.patients = resp.patients;
                                        vm.totalPatients = resp.patientsNum;
                                    } else {
                                        vm.noData = true;
                                        vm.totalPatients = 0;
                                    }
                                    resolve(resp);
                                })
                                .catch(err => {
                                    vm.serverError = true;
                                    console.log(err);
                                })
                                .then(() => {
                                    vm.searching = false;
                                })
                        );
                    }, DELAY);
                }
            }).catch(err => {
                this.searching = false;
                this.serverError = true;
            });
            return promise;
        },
        handleAllergy(items) {},
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
            this.$store.dispatch(AUTH_LOGOUT).then(() => {
                this.$router.push({ name :"Login", params: { lang: this.$i18n.locale } });
            });
        },
        lock() {
            this.$store.dispatch(AUTH_LOCK).then(() => {
                this.$router.push("lock");
            });
        }
    },
    computed: {
        ...mapGetters({
            loading: "loading",
            patient: "getPatient",
            clinics: "getClinics",
            currnentClinic: "getCurrentClinic",
            accessToken: "fetchStateAccessToken",
            expiresAt: "expiresAt",
            lang: "getLang"
        }),
        languages() {
            return AVAILABLE_LANGUAGES;
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
.patient-header-avatar {
    width: 40px;
}
.wrapper-progress-bar {
    position: fixed;
    top: 1px;
    right: 0;
    width: 100%;
    height: 5px;
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

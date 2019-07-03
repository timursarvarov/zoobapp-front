<template>
    <md-toolbar
        md-elevation="0"
        class="md-transparent top-navbar-wrapper"
        :class="{'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute}"
    >
        <div class="wrapper-progress-bar">
            <md-progress-bar v-show="loading" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
                <h3 class="md-title">
                    <template
                        class="md-layout md-alignment-left-center"
                        v-if="$route.name === 'Profile' && (patient.firstName || patient.secondName) "
                    >
                        <t-avatar
                            class="patient-header-avatar"
                            :color="patient.color"
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
                            <!-- <span class="notification">{{patient.allergy.length}}</span> -->
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

                <cool-select
                    tabindex="0"
                    v-model="searchTerm"
                    :searchText.sync="searchText"
                    :items="patients"
                    :loading="searching"
                    item-text="firstName"
                    placeholder="Enter patient name"
                    disable-filtering-by-search
                    loadingIndicator="spinner"
                    :arrowsDisableInstantSelection="true"
                    :disableFirstItemSelectOnEnter="true"
                    @select="goToPatient"
                    @search="getPatients"
                >
                    <template slot="input-end">
                        <div class="input-end">
                            <md-progress-spinner
                                v-if="searching"
                                :md-diameter="30"
                                :md-stroke="3"
                                md-mode="indeterminate"
                            ></md-progress-spinner>
                        </div>
                    </template>

                    <template slot="no-data">
                        <div v-if="serverError">
                            <div class="md-layout">
                                <div
                                    class="md-layout-item"
                                    style="padding: 15px 0;"
                                >
                                <md-subheader>
                                    Oops! Connection problems
                                </md-subheader>
                                        <div class="md-layout-item md-size-100">
                                            <md-button
                                                class="md-primary md-layout-item mx-auto md-sm"
                                                @click="getPatients()"
                                            >Retry</md-button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="!noData || searchText.length<3">
                            <div class="md-layout">
                                <div
                                    style="padding: 15px 0 0 0;"
                                >
                                    <md-subheader>
                                    Type at least 3 letters to search by phone, email or name
                                    </md-subheader>
                                    </div>
                            </div>
                        </div>
                        <div v-else class="md-layout" style="white-space: pre-wrap;oveflow:hidden;">
                            <div
                                class="md-size-100 md-layout md-alignment-center-center"
                                style="white-space: pre-wrap;oveflow:hidden; padding: 15px 0;"
                            >
                                <span
                                    class="md-layout-item"
                                >No patients matching "{{ searchText }}" were found.</span>
                            </div>
                            <div class="md-layout-item md-size-100">
                                <md-button
                                    class="md-primary md-layout-item mx-auto md-sm"
                                    @click="showPatientAddForm()"
                                >Create patient</md-button>
                            </div>
                        </div>
                    </template>
                    <template v-if="item" slot="item" slot-scope="{ item }">
                        <div style="display: flex;">
                            <md-button class="IZ-select-button btn-avatar">
                                <t-avatar
                                    class="search-avatar"
                                    :color="item.color"
                                    :imageSrc="item.avatar"
                                    :title="item.firstName + ' ' + item.lastName"
                                    :notification="item.allergy ? 'A' : ''"
                                />
                                <div class="md-serched-list-item-text text-left">
                                    <small >
                                        {{ item.firstName | capitilize}} {{ item.lastName | capitilize }}
                                        <br />
                                    </small>
                                    <small v-if="item.phone">{{ "+" + item.phone }}</small>
                                </div>
                                <!-- <span class="text-right" >{{`${item.phone}`}} {{currnentClinic.currencyCode}}</span> -->
                            </md-button>
                        </div>
                    </template>
                    <template v-if="patients.length >1" slot="after-items">
                        <div style="display: flex;">
                            <div style="flex-grow:1" class="md-layout-item">
                                <infinite-loading
                                    @infinite="infiniteHandler"
                                    :identifier="infiniteId"
                                    :key="patients.length"
                                >
                                    <div slot="spinner">
                                        <md-progress-spinner
                                            :md-diameter="40"
                                            :md-stroke="4"
                                            md-mode="indeterminate"
                                        />
                                    </div>
                                    <!-- <div slot="no-more">
                                        <md-subheader>No more patients</md-subheader>
                                    </div> -->
                                    <div slot="no-results">
                                          <md-subheader>No more patients</md-subheader>
                                    </div>
                                    <div slot="error" slot-scope="{ trigger }">
                                        <div class="md-layout">
                                        <div
                                            class="md-layout-item"
                                            style="padding: 15px 0;"
                                        >
                                        <md-subheader>
                                            Oops! Connection problems
                                        </md-subheader>
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
                </cool-select>

                <!--  <t-auto-complite
                            autocomplete="off"
                            v-model="searchTerm"
                            class="search"
                            md-dense
                            @md-selected="goToPatient"
                            :md-options="patients"
                            @md-changed="getPatients"
                            @md-opened="getPatients"
                            >
                            <label v-if="$route.meta.rtlActive">بحث...</label>
                            <label v-else>Search patient</label>
                            <template slot="md-autocomplete-item" slot-scope="{ item }">
                                <t-avatar
                                    class="search-avatar"
                                    :color="item.color"
                                    :imageSrc="item.avatar"
                                    :title="item.firstName + ' ' + item.lastName"
                                    :notification="item.allergy ? 'A' : ''"
                                />

                                <span class="md-serched-list-item-text">
                                    {{ item.firstName | capitilize}} {{ item.lastName | capitilize }}
                                    <br>
                                    <small v-if="item.phone">{{ "+" + item.phone }}</small>
                                </span>
                            </template>
                            <template slot="md-autocomplete-empty" slot-scope="{ term }">
                                <div
                                    class="md-layout"
                                    v-if="term.length >= 3 && !searching"
                                    style="white-space: pre-wrap;oveflow:hidden;"
                                >
                                    <span
                                        class="md-layout-item md-size-100"
                                        style="white-space: pre-wrap;oveflow:hidden;"
                                    >No patients matching "{{ term }}" were found.</span>
                                    <md-button
                                        class="md-primary md-layout-item mx-auto md-sm"
                                        @click="showPatientAddForm()"
                                    >Create patient</md-button>
                                </div>
                                <span
                                    v-if="term.length < 3 && !searching && 0 < term.length"
                                >At least 3 characters required</span>
                                <div v-if="searching" class="for-loader"></div>
                                <span v-if="term.length === 0 && !searching">
                                    Type to search by
                                    <br>phone, email or name
                                </span>
                            </template>
                </t-auto-complite>-->
                <md-list>
                    <md-list-item to="/">
                        <i class="material-icons">dashboard</i>
                        <p class="hidden-lg hidden-md">Dashboard</p>
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
                                                class="dropdown-toggle"
                                                :class="{'open': multiLevel1}"
                                                @click="multiLevel1 = !multiLevel1"
                                            >
                                                Current language:
                                                <span
                                                    style="text-transform: uppercase;"
                                                >&nbsp;{{$i18n.locale}}</span>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li
                                                    @click="$i18n.locale = 'ru' "
                                                    :class="[{'selected-menu-top-navbar': $i18n.locale === 'ru' }]"
                                                >
                                                    <a
                                                        @click="multiLevel1 = !multiLevel1"
                                                        :style="{color:  $i18n.locale === 'ru' ? '#fff!important': ''}"
                                                        href="#"
                                                    >ru</a>
                                                </li>
                                                <li
                                                    @click="$i18n.locale = 'en' "
                                                    :class="[{'selected-menu-top-navbar': $i18n.locale === 'en' }]"
                                                >
                                                    <a
                                                        @click="multiLevel1 = !multiLevel1"
                                                        :style="{color:  $i18n.locale === 'en' ? '#fff!important': ''}"
                                                        href="#"
                                                    >en</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a
                                                class="dropdown-toggle"
                                                :class="{'open': multiLevel}"
                                                @click="toggleMultiLevel"
                                            >Change Clinic</a>
                                            <ul class="dropdown-menu">
                                                <li
                                                    @click="setClinic(clinic.ID), toggleMultiLevel()"
                                                    :class="[{'selected-menu-top-navbar': clinic.ID === currnentClinic.ID }]"
                                                    v-for="(clinic, index) in clinics"
                                                    :key="index"
                                                >
                                                    <a
                                                        :style="{color: clinic.ID === currnentClinic.ID ? '#fff!important': ''}"
                                                        href="#"
                                                    >{{clinic.name | capitilize }}{{clinic.ID }}</a>
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
    </md-toolbar>
</template>

<script>
/* eslint-disable */
import {
    CLINIC_AUTH_REQUEST,
    AUTH_LOGOUT,
    PATIENTS_REQUEST,
    AUTH_LOCK,
    NOTIFY
} from "@/constants";
import { mapGetters } from "vuex";
import { TAutoComplite, TAvatar } from "@/components";
import { CoolSelect } from "vue-cool-select";
import InfiniteLoading from "vue-infinite-loading";

export default {
    components: {
        TAutoComplite,
        TAvatar,
        CoolSelect,
        InfiniteLoading
    },
    data() {
        return {
            callbackLauncher: null,
            infiniteId: 1,
            searchText: '',
            searchTerm: "",
            patients: [],
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
                    name: "Profile",
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
                        search: this.searchTerm,
                        toStore: false
                    }
                })
                .then(resp => {
                    if (resp) {
                        this.searching = false;
                        console.log(resp)
                        if(resp.length < this.perPage) {
                                $state.complete();
                            } else{
                                $state.loaded();
                            }
                                this.patients.push(...resp);

                        }
                })
                .catch(err => {
                    console.log(1, err);
                    $state.error();
                });;
        },
        getPatients() {
            this.lastSearchItem = this.searchText;
            const promise = new Promise((resolve, reject) => {
                if (!this.searchText || this.searchText.length < 3) {
                    resolve([]);
                } else {
                    this.noData = false;
                    this.serverError = false;
                    this.searching =  true;
                    const vm = this;
                    const DELAY = 400;
                    if (this.callbackLauncher) {
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
                                        perPage: this.perPage,
                                        page: this.page,
                                        search: this.searchText,
                                        toStore: false
                                    }
                                })
                                .then(resp => {
                                    if (resp) {
                                        console.log(resp)
                                        vm.searching = false;
                                        vm.patients = resp;
                                    }
                                    resolve(resp);
                                })
                        );
                    }, DELAY);
                }
            }).catch(err => {
                this.searching = false;
                this.serverError = true;
                console.log(err);
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
                this.$router.push("/login");
            });
        },
        lock() {
            this.$store.dispatch(AUTH_LOCK).then(() => {
                this.$router.push("/lock");
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
        })
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

<template>
    <cool-select
        v-model="searchTerm"
        class="patient-select with-action md-field"
        :class="[{ 'md-focused': coolSelectFocus || searchTerm }, { 'no-after-no-before': searching }]"
        style="width:300px;"
        tabindex="0"
        :search-text.sync="searchText"
        :items="patients"
        :loading="searching"
        item-text="firstName"
        disable-filtering-by-search
        loading-indicator="spinner"
        :arrows-disable-instant-selection="true"
        :disable-first-item-select-on-enter="true"
        @focus="coolSelectFocus = true"
        @blur="coolSelectFocus = false"
        @select="goToPatient"
        @search="getPatients"
    >
        <template slot="input-end">
            <md-button
                v-show="searchTerm"
                tabindex="-1"
                class="md-button md-icon-button md-dense md-input-action noselect md-simple"
                @click="searchTerm = null"
            >
                <md-icon class="success">
                    close
                </md-icon>
            </md-button>
        </template>
        <template slot="input-start">
            <label for="input"> {{ $t(`${$options.name}.label`) }}</label>
        </template>
        <template slot="input-after">
            <md-progress-bar v-if="searching" class="underline-progress-bar" :md-stroke="2" md-mode="indeterminate" />
        </template>
        <template slot="no-data">
            <div v-if="!serverError && searchText.length < 3">
                <div class="md-layout">
                    <div>
                        <md-subheader class="text-center">
                            {{ $t(`${$options.name}.searchMin`) }}
                        </md-subheader>
                    </div>
                </div>
            </div>
            <div v-else-if="noData">
                <div class="md-layout">
                    <div class="md-size-100 md-layout md-alignment-center-center" style="oveflow:hidden; padding: 0 0 15px 0;">
                        <span class="md-layout-item">
                            {{ $t(`${$options.name}.noFound`, { searchText }) }}
                        </span>
                    </div>
                    <div class="md-layout md-layout-item md-alignment-center md-size-100">
                        <md-button class="md-success md-sm" @click="showPatientAddForm()">
                            {{ $t(`${$options.name}.createPatient`) }}
                        </md-button>
                    </div>
                </div>
            </div>

            <div v-else-if="serverError">
                <md-subheader class="text-center">
                    {{ $t(`${$options.name}.connectionProblems`) }}
                </md-subheader>

                <md-button class="md-success md-layout-item md-sm" @click="getPatients()">
                    {{ $t(`${$options.name}.retry`) }}
                </md-button>
            </div>
        </template>
        <template v-if="item" slot="item" slot-scope="{ item }">
            <div style="display: flex;">
                <md-button class="IZ-select-button btn-avatar md-button" tag="button">
                    <t-avatar
                        class="search-avatar"
                        :text-to-color="item.ID"
                        :image-src="item.avatar"
                        :title="item.firstName + ' ' + item.lastName"
                        :notification="item.allergy && item.allergy.length ? 'A' : ''"
                    />
                    <div class="md-serched-list-item-text text-left">
                        <span>
                            {{ item.firstName | capitilize }} {{ item.lastName | capitilize }}
                            <br />
                        </span>
                        <span v-if="item.phone">{{ '+' + item.phone }}</span>
                    </div>
                </md-button>
            </div>
        </template>
        <template v-if="patients ? patients.length > 1 : false" slot="after-items">
            <div style="display: flex;">
                <div style="flex-grow:1" class="md-layout-item">
                    <infinite-loading :key="patients ? patients.length : 0" :identifier="infiniteId" @infinite="infiniteHandler">
                        <div slot="spinner">
                            <md-progress-spinner :md-diameter="40" :md-stroke="4" md-mode="indeterminate" />
                        </div>
                        <div slot="no-results">
                            <div class="md-title text-center">
                                {{ $t(`${$options.name}.noMore`) }}
                            </div>
                        </div>
                        <div slot="error" slot-scope="{ trigger }">
                            <div class="md-layout">
                                <div class="md-layout-item" style="padding: 15px 0;">
                                    <md-subheader class="text-center">
                                        {{ $t(`${$options.name}.connectionProblems`) }}
                                    </md-subheader>
                                    <div class="md-layout-item md-size-100">
                                        <md-button class="md-primary md-layout-item mx-auto md-sm" @click="trigger">
                                            {{ $t(`${$options.name}.retry`) }}
                                        </md-button>
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
                <div style="flex-grow:1" class="md-layout-item md-layout text-center">
                    <small style="padding: 4px; text-align: center;" class="md-layout-item ml-auto md-caption text-center">{{
                        $tc(`${$options.name}.total`, totalPatients)
                    }}</small>
                </div>
            </div>
        </template>
    </cool-select>
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
    PATIENT_GET,
} from "@/constants";
import { mapGetters } from "vuex";
import tAvatar from "@/components/CustomComponents/TAvatar";
import { CoolSelect } from "vue-cool-select";
import InfiniteLoading from "vue-infinite-loading";

export default {
    name: 'TCoolSelectPatientSearch',
    components: {
        tAvatar,
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
            noData: false,
            perPage: 20,
            page: 1
        };
    },
    methods: {
        goToPatient(patient) {
            if (patient) {
                 this.$router.push({
                    name: 'Bio',
                    params: {
                        lang: this.$i18n.locale,
                        patientID: patient.ID,
                    },
                });
                 this.$store.dispatch(NOTIFY, {
                        settings: {
                            message: 'Patient changed',
                            type: 'success',
                        },
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
                    throw new Error(err);;
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
                                    throw new Error(err);;
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
        }
    },
    computed: {
        ...mapGetters({
            loading: "loading",
            patient: "getPatient",
            clinics: "getClinics",
            user: "getProfile",
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

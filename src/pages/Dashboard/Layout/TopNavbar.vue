<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute}"
  >
    <div class="wrapper-progress-bar">
      <md-progress-bar
        v-show="loading"
        md-mode="indeterminate"
      ></md-progress-bar>
    </div>
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{$route.name}}</h3>
      </div>

      <div v-if="$route.path.startsWith('/patient/')">

        <h3 class="md-title">
          {{patient.firstName}} {{patient.lastName}}
          <md-button
            @click="handleAllergy(patient.allergy)"
            v-if="patient.allergy &&  patient.allergy.length>0"
            class="md-icon-button md-simple md-danger   md-round  md-just-icon"
          >
            <md-icon>report_problem</md-icon>
            <!-- <span class="notification">{{patient.allergy.length}}</span> -->
            <md-tooltip>Attention allergy!</md-tooltip>
          </md-button>
        </h3>

      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon  md-round  md-round md-simple md-toolbar-toggle"
          :class="{toggled: $sidebar.showSidebar}"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-autocomplete">
            <mdt-auto-complite
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
              <label v-else>Search...</label>
              <template
                slot="md-autocomplete-item"
                slot-scope="{ item }"
              >
                <t-avatar
                  class="search-avatar"
                  :color="item.color"
                  :imageSrc="item.avatar"
                  :title="item.firstName + ' ' + item.lastName"
                />

                <span class="md-serched-list-item-text"> {{ item.firstName | capitilize}} {{ item.lastName | capitilize }}
                  <br>
                  <small v-if="item.phone">{{ "+" + item.phone }}</small>
                </span>

              </template>
              <template
                slot="md-autocomplete-empty"
                slot-scope="{ term }"
              >
                <div
                  class="md-layout"
                  v-if="term.length >= 3 && !searching"
                  style="white-space: pre-wrap;oveflow:hidden;"
                >
                  <span
                    class="md-layout-item  md-size-100"
                    style="white-space: pre-wrap;oveflow:hidden;"
                  >No patients matching "{{ term }}" were found.</span>
                  <md-button
                    class="md-primary md-layout-item mx-auto md-sm"
                    @click="showPatientAddForm()"
                  >Create patient</md-button>
                </div>
                <span v-if="term.length < 3 && !searching && 0 < term.length">
                  At least 3 characters required
                </span>
                <div
                  v-if="searching"
                  class="for-loader"
                >

                </div>
                <span v-if="term.length === 0 && !searching">
                  Type to search by<br /> phone, email or name
                </span>
              </template>
            </mdt-auto-complite>
          </div>
          <md-list>
            <md-list-item to="/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
            <md-list-item
              class="md-primary  md-round  md-simple md-just-icon "
              @click="showPatientAddForm()"
            >
              <i class="material-icons">person_add</i>
              <p class="hidden-lg hidden-md">Add Patient</p>
            </md-list-item>

            <li class="md-list-item">
              <a class="md-list-item-router md-list-item-container md-button-clean dropdown">
                <div class="md-list-item-content">
                  <drop-down direction="down">
                    <md-button
                      slot="title"
                      class="md-button  md-round  md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>notifications</md-icon>
                      <span class="notification">5</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li><a href="#">Mike John responded to your email</a></li>
                      <li><a href="#">You have 5 new tasks</a></li>
                      <li><a href="#">You're now friend with Andrew</a></li>
                      <li><a href="#">Another Notification</a></li>
                      <li><a href="#">Another One</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>
            <li class="md-list-item">
              <a class="md-list-item-router md-list-item-container md-button-clean dropdown">
                <div class="md-list-item-content">
                  <drop-down direction="down">
                    <md-button
                      slot="title"
                      class="md-button  md-round  md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>more_vert</md-icon>
                      <p class="hidden-lg hidden-md">More</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li>
                        <router-link
                          tag="a"
                          to="/pages/user"
                        >My Profile</router-link>
                      </li>
                      <li  @click="showPatientAddForm()" class="md-layout" ><a href="#" class="md-layout-item">Add new Patient</a></li>
                      <li @click="lock()" class="md-layout" ><a href="#" class="md-layout-item">Lock</a></li>
                      <li @click="logout()"> <a href="#">Logout</a></li>
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
import swal from "sweetalert2";
import {
  AUTH_LOGOUT,
  PATIENTS_REQUEST,
  AUTH_LOCK
} from "@/constants";
import { mapGetters } from "vuex";
import { MdtAutoComplite, TAvatar } from "@/components";

export default {
  components: {
    MdtAutoComplite,
    TAvatar
  },
  data() {
    return {
      callbackLauncher: null,
      searchTerm: "",
      patients: [],
      searching: false
    };
  },
  methods: {
    goToPatient(patient) {
      if (patient) {
        this.$router.push({
          name: "Diagnose",
          params: { patientId: patient.ID }
        });
      }
    },
    getPatients(searchTerm) {
      if (typeof searchTerm === "string") {
        (this.lastSearchItem = searchTerm),
          (this.patients = new Promise(resolve => {
            if (!searchTerm || searchTerm.length < 3) {
              resolve([]);
            } else {
              this.searching = true;
              const vm = this;
              const DELAY = 400;
              if (this.callbackLauncher) {
                clearTimeout(vm.callbackLauncher);
              }

              this.callbackLauncher = setTimeout(() => {
                resolve(
                  vm.$store
                    .dispatch(PATIENTS_REQUEST, {
                      params: {
                        perPage: 1000,
                        page: 1,
                        search: searchTerm,
                        toStore: false
                      }
                    })
                    .then(resp => {
                      if (resp) {
                        vm.searching = false;
                        return resp.data === null ? [] : resp.data;
                      }
                    })
                    .catch(err => {
                      vm.searching = false;
                    })
                );
              }, DELAY);
            }
          }));
      }
    },
    handleAllergy(items) {
      swal({
        title: "The patient has allergies!",
        text: `${items.join(" ,")}`,
        type: "warning",
        buttonsStyling: false,
        confirmButtonClass: "md-button md-danger"
      });
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
      patient: "getPatient"
    })
  }
};
</script>

<style style="scss" >
.wrapper-progress-bar {
  position: fixed;
  top: 1px;
  right: 0;
  width: 100%;
  height: 5px;
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
}
.search-avatar {
  margin: 0 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>

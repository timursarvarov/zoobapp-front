<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute}"
  >
    <div class="wrapper-progre-bar">
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
            class="md-icon-button md-simple md-danger  md-just-icon"
          >
            <md-icon>report_problem</md-icon>
            <!-- <span class="notification">{{patient.allergy.length}}</span> -->
            <md-tooltip>Attention allergy!</md-tooltip>
          </md-button>
        </h3>

      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{toggled: $sidebar.showSidebar}"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-autocomplete">
            <md-autocomplete
              class="search"
              v-model="selectedEmployee"
              :md-options="employees"
              :md-open-on-focus="false"
            >
              <label v-if="$route.meta.rtlActive">بحث...</label>
              <label v-else>Search...</label>
            </md-autocomplete>
          </div>
          <md-list>
            <md-list-item to="/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>
            <md-list-item
              class="md-primary md-simple md-just-icon "
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
                      class="md-button md-just-icon md-simple"
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
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>person</md-icon>
                      <!-- <p class="hidden-lg hidden-md">Notifications</p> -->
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li @click="lock()"> <a href="#">Lock</a></li>
                      <li @click="logout()"> <a href="#">Logout</a></li>
                      <li>
                        <router-link
                          tag="a"
                          to="/pages/user"
                        >Profile</router-link>
                      </li>
                      <li><a href="#">You're now friend with Andrew</a></li>
                      <li><a href="#">Another Notification</a></li>
                      <li><a href="#">Another One</a></li>
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
  import swal from 'sweetalert2';
  import { AUTH_LOGOUT, AUTH_LOCK } from '@/store/modules/constants';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        selectedEmployee: '',
        employees: [
          'Jim Halpert',
          'Dwight Schrute',
          'Michael Scott',
          'Pam Beesly',
          'Angela Martin',
          'Kelly Kapoor',
          'Ryan Howard',
          'Kevin Malone',
        ],
      };
    },
    methods: {
      handleAllergy(items) {
        swal({
          title: 'The patient has allergies!',
          text: `${items.join(' ,')}`,
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'md-button md-danger',
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
          this.$router.push('/login');
        });
      },
      lock() {
        this.$store.dispatch(AUTH_LOCK).then(() => {
          this.$router.push('/lock');
        });
      },
    },
    computed: {
      ...mapGetters({
        loading: 'loading',
        patient: 'getPatient',
      }),
    },
  };
</script>

<style style="scss" >
.wrapper-progre-bar {
  position: fixed;
  top: 1px;
  right: 0;
  width: 100%;
  height: 5px;
}

.search {
  margin: 0 !important;
}

.md-toolbar {
}
</style>

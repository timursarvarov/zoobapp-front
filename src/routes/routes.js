import store from '@/store';
import DashboardLayout from '@/pages/Dashboard/Layout/DashboardLayout.vue';
import AuthLayout from '@/pages/Dashboard/Pages/AuthLayout.vue';

// Dashboard pages
import Dashboard from '@/pages/Dashboard/Dashboard.vue';
import Widgets from '@/pages/Dashboard/Widgets.vue';

// Pages
const ClinicSettings = () => import('@/pages/Dashboard/Pages/ClinicSettings.vue');
// Pages
const User = () => import('@/pages/Dashboard/Pages/UserProfile.vue');

const PatientProfile = () => import('@/pages/Dashboard/Pages/PatientProfile.vue');
const PatientTreatment = () => import('@/pages/Dashboard/Pages/PatientTreatment.vue');
const PatientMedia = () => import('@/pages/Dashboard/Pages/PatientMedia.vue');

const PatientsList = () => import('@/pages/Dashboard/Pages/PatientsList.vue');

const Pricing = () => import('@/pages/Dashboard/Pages/Pricing.vue');
const TimeLine = () => import('@/pages/Dashboard/Pages/TimeLinePage.vue');
const RtlSupport = () => import('@/pages/Dashboard/Pages/RtlSupport.vue');
const Login = () => import('@/pages/Dashboard/Pages/Login.vue');
const Register = () => import('@/pages/Dashboard/Pages/Register.vue');
const Lock = () => import('@/pages/Dashboard/Pages/Lock.vue');

// Components pages
const Buttons = () => import('@/pages/Dashboard/Components/Buttons.vue');
const GridSystem = () => import('@/pages/Dashboard/Components/GridSystem.vue');
const Panels = () => import('@/pages/Dashboard/Components/Panels.vue');
const SweetAlert = () => import('@/pages/Dashboard/Components/SweetAlert.vue');
const Notifications = () => import('@/pages/Dashboard/Components/Notifications.vue');
const Icons = () => import('@/pages/Dashboard/Components/Icons.vue');
const Typography = () => import('@/pages/Dashboard/Components/Typography.vue');

// Forms pages
const RegularForms = () => import('@/pages/Dashboard/Forms/RegularForms.vue');
const ExtendedForms = () => import('@/pages/Dashboard/Forms/ExtendedForms.vue');
const ValidationForms = () => import('@/pages/Dashboard/Forms/ValidationForms.vue');
const Wizard = () => import('@/pages/Dashboard/Forms/Wizard.vue');

// TableList pages
const RegularTables = () => import('@/pages/Dashboard/Tables/RegularTables.vue');
const ExtendedTables = () => import('@/pages/Dashboard/Tables/ExtendedTables.vue');
const PaginatedTables = () => import('@/pages/Dashboard/Tables/PaginatedTables.vue');

// Maps pages
const GoogleMaps = () => import('@/pages/Dashboard/Maps/GoogleMaps.vue');
const FullScreenMap = () => import('@/pages/Dashboard/Maps/FullScreenMap.vue');
const VectorMaps = () => import('@/pages/Dashboard/Maps/VectorMaps.vue');

// Calendar
const Calendar = () => import('@/pages/Dashboard/Calendar.vue');

// Charts
const Charts = () => import('@/pages/Dashboard/Charts.vue');

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};
const isProfileLoaded = (to, from, next) => {
  if (store.getters.isProfileLoaded) {
    next();
    return;
  }
  next('/login');
};
const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  if (store.getters.isProfileLoaded) {
    next('/lock');
    return;
  }
  next('/login');
};

const componentsMenu = {
  path: '/components',
  component: DashboardLayout,
  redirect: '/components/buttons',
  beforeEnter: ifAuthenticated,
  name: 'Components',
  children: [{
      path: 'buttons',
      name: 'Buttons',
      components: {
        default: Buttons,
      },
    },
    {
      path: 'grid-system',
      name: 'Grid System',
      components: {
        default: GridSystem,
      },
    },
    {
      path: 'panels',
      name: 'Panels',
      components: {
        default: Panels,
      },
    },
    {
      path: 'sweet-alert',
      name: 'Sweet Alert',
      components: {
        default: SweetAlert,
      },
    },
    {
      path: 'notifications',
      name: 'Notifications',
      components: {
        default: Notifications,
      },
    },
    {
      path: 'icons',
      name: 'Icons',
      components: {
        default: Icons,
      },
    },
    {
      path: 'typography',
      name: 'Typography',
      components: {
        default: Typography,
      },
    },
  ],
};
const formsMenu = {
  path: '/forms',
  component: DashboardLayout,
  redirect: '/forms/regular',
  beforeEnter: ifAuthenticated,
  name: 'Forms',
  children: [{
      path: 'regular',
      name: 'Regular Forms',
      components: {
        default: RegularForms,
      },
    },
    {
      path: 'extended',
      name: 'Extended Forms',
      components: {
        default: ExtendedForms,
      },
    },
    {
      path: 'validation',
      name: 'Validation Forms',
      components: {
        default: ValidationForms,
      },
    },
    {
      path: 'wizard',
      name: 'Wizard',
      components: {
        default: Wizard,
      },
    },
  ],
};

const tablesMenu = {
  path: '/table-list',
  component: DashboardLayout,
  redirect: '/table-list/regular',
  beforeEnter: ifAuthenticated,
  name: 'Tables',
  children: [{
      path: 'regular',
      name: 'Regular Tables',
      components: {
        default: RegularTables,
      },
    },
    {
      path: 'extended',
      name: 'Extended Tables',
      components: {
        default: ExtendedTables,
      },
    },
    {
      path: 'paginated',
      name: 'Pagianted Tables',
      components: {
        default: PaginatedTables,
      },
    },
  ],
};

const mapsMenu = {
  path: '/maps',
  component: DashboardLayout,
  name: 'Maps',
  redirect: '/maps/google',
  beforeEnter: ifAuthenticated,
  children: [{
      path: 'google',
      name: 'Google Maps',
      components: {
        default: GoogleMaps,
      },
    },
    {
      path: 'full-screen',
      name: 'Full Screen Map',
      meta: {
        hideContent: true,
        hideFooter: true,
        navbarAbsolute: true,
      },
      components: {
        default: FullScreenMap,
      },
    },
    {
      path: 'vector-map',
      name: 'Vector Map',
      components: {
        default: VectorMaps,
      },
    },
  ],
};

const pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  name: 'Pages',
  redirect: '/pages/user',
  beforeEnter: ifAuthenticated,
  children: [{
      path: 'user',
      name: 'User Page',
      components: {
        default: User,
      },
    },
    {
      path: 'timeline',
      name: 'Timeline Page',
      components: {
        default: TimeLine,
      },
    },
    {
      path: 'rtl',
      name: 'وحة القيادة',
      meta: {
        rtlActive: true,
      },
      components: {
        default: RtlSupport,
      },
    },
  ],
};
const Settings = {
  path: '/settings',
  component: DashboardLayout,
  name: 'Settings',
  redirect: '/settings/user',
  beforeEnter: ifAuthenticated,
  children: [{
      path: 'user',
      name: 'My Profile',
      components: {
        default: User,
      },
    },
    {
      path: 'clinic',
      name: 'Clinic',
      components: {
        default: ClinicSettings,
      },
    },
    {
      path: 'services',
      name: 'Services',
      components: {
        default: User,
      },
    },
    {
      path: 'payment',
      name: 'Payment',
      components: {
        default: User,
      },
    },
    {
      path: 'users',
      name: 'Users',
      components: {
        default: User,
      },
    },
    {
      path: 'notifications',
      name: 'Notification',
      components: {
        default: User,
      },
    },
  ],
};

const authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [{
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: Pricing,
    },
    {
      path: '/lock',
      name: 'Lock',
      component: Lock,
      beforeEnter: isProfileLoaded,
    },
  ],
};

const PatientPages = {
  path: '/patient',
  component: DashboardLayout,
  name: 'Patient',
  redirect: '/patient/:patientId/treatment/diagnose/',
  beforeEnter: ifAuthenticated,
  children: [{
      path: '/patient/:patientId/bio',
      name: 'BIO',
      component: PatientProfile,
    },
    {
      path: '/patient/:patientId/treatment',
      name: 'PatientTreatment',
      component: PatientTreatment,
      redirect: '/patient/:patientId/treatment/anamnes',
      children: [{
          path: '/patient/:patientId/treatment/anamnes',
          name: 'Anamnes',
          component: PatientTreatment,
        },
        {
          path: '/patient/:patientId/treatment/diagnose',
          name: 'Diagnose',
          component: PatientTreatment,
        },
        {
          path: '/patient/:patientId/treatment/notes',
          name: 'Notes',
          component: PatientTreatment,
        },
        {
          path: '/patient/:patientId/treatment/therapy',
          name: 'Therapy',
          component: PatientTreatment,
        },
      ],
    },
    {
      path: '/patient/:patientId/media',
      name: 'Media',
      component: PatientMedia,
    },
  ],
};

const routes = [{
    path: '/',
    redirect: '/dashboard',
    name: 'Home',
  },
  componentsMenu,
  PatientPages,
  formsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  Settings,
  authPages,
  {
    path: '/',
    component: DashboardLayout,
    beforeEnter: ifAuthenticated,
    children: [{
        path: 'dashboard',
        name: 'Dashboard',
        components: {
          default: Dashboard,
        },
      },
      {
        path: 'calendar',
        name: 'Calendar',
        components: {
          default: Calendar,
        },
      },
      {
        path: 'patients',
        name: 'Patients',
        components: {
          default: PatientsList,
        },
      },
      {
        path: 'charts',
        name: 'Charts',
        components: {
          default: Charts,
        },
      },
      {
        path: 'widgets',
        name: 'Widgets',
        components: {
          default: Widgets,
        },
      },
    ],
  },
];

export default routes;

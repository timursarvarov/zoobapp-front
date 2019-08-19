/* eslint-disable implicit-arrow-linebreak */
import store from '@/store';
import { Trans } from '@/plugins/translation';

function load(path) {
    return () =>
        import ( /* webpackChunkName: "[request]" */ `@/pages/Dashboard/${path}.vue`);
}
const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isStateAuthenticated) {
        next();
        return;
    }
    next(`/${Trans.getUserSupportedLang()}/dashboard`);
};
const ifAuthenticatedNotselectedClinic = (to, from, next) => {
    if (store.getters.isStateAuthenticated && store.getters.getClinics.length > 0) {
        next();
        return;
    }
    next(`/${Trans.getUserSupportedLang()}/login`);
};
const isProfileLoaded = (to, from, next) => {
    console.log(store.getters.isProfileLoaded);
    if (store.getters.isProfileLoaded) {
        next();
        return;
    }
    next(`/${Trans.getUserSupportedLang()}/login`);
};
const ifAuthenticated = (to, from, next) => {
    if (store.getters.isStateAuthenticated) {
        next();
        return;
    }
    if (store.getters.isProfileLoaded) {
        next(`/${Trans.getUserSupportedLang()}/lock`);
        return;
    }

    next(`/${Trans.getUserSupportedLang()}/login`);
};

const componentsMenu = {
    path: 'components',
    component: load('Layout/DashboardLayout'),
    redirect: 'buttons',
    beforeEnter: ifAuthenticated,
    name: 'Components',
    children: [{
            path: 'buttons',
            name: 'Buttons',
            component: load('Components/Buttons'),
        },
        {
            path: 'grid-system',
            name: 'Grid System',
            component: load('Components/GridSystem'),
        },
        {
            path: 'panels',
            name: 'Panels',
            component: load('Components/Panels'),
        },
        {
            path: 'sweet-alert',
            name: 'Sweet Alert',
            component: load('Components/SweetAlert'),
        },
        {
            path: 'notifications',
            name: 'Notifications',
            component: load('Components/Notifications'),
        },
        {
            path: 'icons',
            name: 'Icons',
            component: load('Components/Icons'),
        },
        {
            path: 'typography',
            name: 'Typography',
            component: load('Components/Typography'),
        },
    ],
};
const formsMenu = {
    path: 'forms',
    component: load('Layout/DashboardLayout'),
    redirect: 'regular',
    beforeEnter: ifAuthenticated,
    name: 'Forms',
    children: [{
            path: 'regular',
            name: 'Regular Forms',
            component: load('Forms/RegularForms'),
        },
        {
            path: 'extended',
            name: 'Extended Forms',
            component: load('Forms/ExtendedForms'),
        },
        {
            path: 'validation',
            name: 'Validation Forms',
            component: load('Forms/ValidationForms'),
        },
        {
            path: 'wizard',
            name: 'Wizard',
            component: load('Forms/Wizard'),
        },
    ],
};

const tablesMenu = {
    path: 'table-list',
    component: load('Layout/DashboardLayout'),
    redirect: 'regular',
    beforeEnter: ifAuthenticated,
    name: 'Tables',
    children: [{
            path: 'regular',
            name: 'Regular Tables',
            component: load('Tables/RegularTables'),
        },
        {
            path: 'extended',
            name: 'Extended Tables',
            component: load('Tables/ExtendedTables'),
        },
        {
            path: 'paginated',
            name: 'Pagianted Tables',
            component: load('Tables/PaginatedTables'),
        },
    ],
};

const mapsMenu = {
    path: 'maps',
    component: load('Layout/DashboardLayout'),
    name: 'Maps',
    redirect: 'google',
    beforeEnter: ifAuthenticated,
    children: [{
            path: 'google',
            name: 'Google Maps',
            component: load('Maps/GoogleMaps'),
        },
        {
            path: 'full-screen',
            name: 'Full Screen Map',
            meta: {
                hideContent: true,
                hideFooter: true,
                navbarAbsolute: true,
            },
            component: load('Maps/FullScreenMap'),
        },
        {
            path: 'vector-map',
            name: 'Vector Map',
            component: load('Maps/VectorMaps'),
        },
    ],
};

const pagesMenu = {
    path: 'pages',
    component: load('Layout/DashboardLayout'),
    name: 'Pages',
    redirect: 'user',
    beforeEnter: ifAuthenticated,
    children: [{
            path: 'user',
            name: 'User Page',
            component: load('Pages/User/UserProfile'),
        },
        {
            path: 'timeline',
            name: 'Timeline Page',
            component: load('Pages/TimeLinePage'),
        },
        {
            path: 'rtl',
            name: 'وحة القيادة',
            meta: {
                rtlActive: true,
            },
            component: load('Pages/RtlSupport'),
        },
    ],
};
const Settings = {
    path: 'settings',
    component: load('Layout/DashboardLayout'),
    name: 'Settings',
    redirect: 'user',
    beforeEnter: ifAuthenticated,
    children: [{
        path: 'user',
        name: 'My Profile',
        component: load('Pages/User/UserProfile'),
    }],
};

const authPages = {
    path: '',
    component: load('Pages/AuthLayout'),
    name: 'Authentication',
    redirect: `/${Trans.getUserSupportedLang()}/login`,
    children: [{
            path: 'login',
            name: 'Login',
            component: load('Pages/Login'),
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: 'choose_clinic',
            name: 'Clinic Selection',
            component: load('Pages/ClinicSelect'),
            // beforeEnter: ifAuthenticatedNotselectedClinic,
        },
        {
            path: 'register',
            name: 'Register',
            component: load('Pages/Registration/Wizard'),
            // beforeEnter: ifNotAuthenticated,
        },
        {
            path: 'pricing',
            name: 'Pricing',
            component: load('Pages/Pricing'),
        },
        {
            path: 'lock',
            name: 'Lock',
            component: load('Pages/Lock'),
            // beforeEnter: isProfileLoaded,
        },
        // {
        //     path: '*',
        //     redirect: `/${Trans.getUserSupportedLang()}/login`,
        // },
    ],
};

const patientPages = {
    path: 'patient',
    component: load('Layout/DashboardLayout'),
    name: 'PatientTreatmentent',
    beforeEnter: ifAuthenticated,
    redirect: `/${Trans.getUserSupportedLang()}/patient/:patientId/treatment`,

    children: [{
        path: ':patientId',
        components: {
            default: load('Pages/Patient/PatientProfile'),
        },
        name: 'PatientTreatmententItems',
        beforeEnter: ifAuthenticated,
        redirect: `/${Trans.getUserSupportedLang()}/patient/:patientId/treatment`,
        children: [{
                path: 'notes',
                name: 'Notes',
                components: {
                    Notes: load('Pages/Patient/Notes'),
                },
            },
            {
                path: 'bio',
                name: 'Bio',
                components: {
                    Bio: load('Pages/Patient/PatientBio/PatientBio'),
                },
            },
            {
                path: 'files',
                name: 'Files',
                components: {
                    Files: load('Pages/Patient/PatientFiles/PatientFiles'),
                },
            },
            {
                path: 'billing',
                name: 'Billing',
                components: {
                    Billing: load('Pages/Patient/PatientBilling/PatientBilling'),
                },
            },
            {
                path: 'treatment',
                name: 'Treatment',
                components: {
                    Treatment: load('Pages/Patient/PatientTreatment/PatientTreatment'),
                },
                redirect: `/${Trans.getUserSupportedLang()}/patient/:patientId/treatment/procedures`,
                children: [{
                        path: 'diagnosis',
                        name: 'diagnosis',
                        components: {
                            search: load('Pages/Patient/PatientTreatment/PatientItemsSearch/PatientDiagnosisSearch'),
                            list: load('Pages/Patient/PatientTreatment/PatientItemsLists/PatientDiagnosisList'),
                        },
                    },
                    {
                        path: 'anamnesis',
                        name: 'anamnesis',
                        components: {
                            search: load('Pages/Patient/PatientTreatment/PatientItemsSearch/PatientAnamnesisSearch'),
                            list: load('Pages/Patient/PatientTreatment/PatientItemsLists/PatientAnamnesisList'),
                        },
                    },
                    {
                        path: 'procedures',
                        name: 'procedures',
                        components: {
                            search: load('Pages/Patient/PatientTreatment/PatientItemsSearch/PatientProceduresSearch'),
                            list: load('Pages/Patient/PatientTreatment/PatientItemsLists/PatientIProceduresList'),
                        },
                        children: [{
                            path: ':planID',
                            name: 'plan',
                        }],
                    },
                ],
            },
        ],
    }],
};

const clinicPages = {
    path: 'clinic/:clinicId',
    component: load('Layout/DashboardLayout'),
    name: 'Clinic',
    beforeEnter: ifAuthenticated,
    redurect: 'Clinic Settings',
    children: [{
            path: 'settings',
            name: 'Clinic Settings',
            component: load('Pages/Clinic/ClinicSettings'),
        },
        {
            path: 'consumables',
            name: 'Consumables',
            component: load('Pages/Clinic/ClinicSettings'),
        },
        {
            path: 'procedures',
            name: 'Clinic Procedures',
            component: load('Pages/Clinic/ClinicSettings'),
        },
        {
            path: 'manipulations',
            name: 'Manipulations',
            component: load('Pages/Clinic/ClinicSettings'),
        },
    ],
};

const routes = [{
        path: '',
        redirect() {
            return Trans.getUserSupportedLang();
        },
    },
    {
        path: '/:lang',
        component: () =>
            import ('@/pages/LayoutWrapper.vue'),
        beforeEnter: Trans.routeMiddleware,
        children: [
            componentsMenu,
            patientPages,
            clinicPages,
            formsMenu,
            tablesMenu,
            mapsMenu,
            pagesMenu,
            Settings,
            authPages,
            {
                path: '',
                redirect: `/${Trans.getUserSupportedLang()}/dashboard`,
                component: load('Layout/DashboardLayout'),
                children: [{
                        path: 'dashboard',
                        name: 'Dashboard',
                        component: load('Dashboard'),
                    },
                    {
                        path: 'calendar',
                        name: 'Calendar',
                        component: load('Calendar'),
                    },
                    {
                        path: 'charts',
                        name: 'Charts',
                        component: load('Charts'),
                    },
                    {
                        path: 'widgets',
                        name: 'Widgets',
                        component: load('Widgets'),
                    },
                    {
                        path: 'patients',
                        name: 'Patients',
                        component: load('Pages/Patients/PatientsList'),
                    },
                    {
                        path: '*',
                        component: () =>
                            import ('@/pages/404.vue'),
                    },
                ],
            },
            {
                path: '*',
                component: () =>
                    import ('@/pages/404.vue'),
            },
        ],
    },

];

export default routes;
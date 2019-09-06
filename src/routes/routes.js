import { Trans } from '@/plugins/translation';

function load(path) {
    return () =>
        import ( /* webpackChunkName: "[request]" */ `@/pages/Dashboard/${path}.vue`);
}

const componentsMenu = {
    path: 'components',
    component: load('Layout/DashboardLayout'),
    redirect: 'buttons',
    meta: { requiresAuth: true },
    name: 'Components',
    children: [{
            path: 'buttons',
            name: 'Buttons',
            meta: { requiresAuth: true },
            component: load('Components/Buttons')
        },
        {
            path: 'grid-system',
            name: 'Grid System',
            meta: { requiresAuth: true },
            component: load('Components/GridSystem')
        },
        {
            path: 'panels',
            name: 'Panels',
            meta: { requiresAuth: true },
            component: load('Components/Panels')
        },
        {
            path: 'sweet-alert',
            name: 'Sweet Alert',
            meta: { requiresAuth: true },
            component: load('Components/SweetAlert')
        },
        {
            path: 'notifications',
            name: 'Notifications',
            meta: { requiresAuth: true },
            component: load('Components/Notifications')
        },
        {
            path: 'icons',
            name: 'Icons',
            meta: { requiresAuth: true },
            component: load('Components/Icons')
        },
        {
            path: 'typography',
            name: 'Typography',
            meta: { requiresAuth: true },
            component: load('Components/Typography')
        }
    ]
};
const formsMenu = {
    path: 'forms',
    component: load('Layout/DashboardLayout'),
    redirect: 'regular',
    name: 'Forms',
    meta: { requiresAuth: true },
    children: [{
            path: 'regular',
            name: 'Regular Forms',
            meta: { requiresAuth: true },
            component: load('Forms/RegularForms')
        },
        {
            path: 'extended',
            name: 'Extended Forms',
            meta: { requiresAuth: true },
            component: load('Forms/ExtendedForms')
        },
        {
            path: 'validation',
            name: 'Validation Forms',
            meta: { requiresAuth: true },
            component: load('Forms/ValidationForms')
        },
        {
            path: 'wizard',
            name: 'Wizard',
            meta: { requiresAuth: true },
            component: load('Forms/Wizard')
        }
    ]
};

const tablesMenu = {
    path: 'table-list',
    component: load('Layout/DashboardLayout'),
    redirect: 'regular',
    name: 'Tables',
    meta: { requiresAuth: true },
    children: [{
            path: 'regular',
            name: 'Regular Tables',
            meta: { requiresAuth: true },
            component: load('Tables/RegularTables')
        },
        {
            path: 'extended',
            name: 'Extended Tables',
            meta: { requiresAuth: true },
            component: load('Tables/ExtendedTables')
        },
        {
            path: 'paginated',
            name: 'Pagianted Tables',
            meta: { requiresAuth: true },
            component: load('Tables/PaginatedTables')
        }
    ]
};

const mapsMenu = {
    path: 'maps',
    component: load('Layout/DashboardLayout'),
    name: 'Maps',
    meta: { requiresAuth: true },
    redirect: 'google',
    children: [{
            path: 'google',
            name: 'Google Maps',
            meta: { requiresAuth: true },
            component: load('Maps/GoogleMaps')
        },
        {
            path: 'full-screen',
            name: 'Full Screen Map',
            meta: {
                requiresAuth: true,
                hideContent: true,
                hideFooter: true,
                navbarAbsolute: true
            },
            component: load('Maps/FullScreenMap')
        },
        {
            path: 'vector-map',
            name: 'Vector Map',
            meta: { requiresAuth: true },
            component: load('Maps/VectorMaps')
        }
    ]
};

const pagesMenu = {
    path: 'pages',
    component: load('Layout/DashboardLayout'),
    name: 'Pages',
    redirect: 'user',
    meta: { requiresAuth: true },
    children: [{
            path: 'user',
            name: 'User Page',
            meta: { requiresAuth: true },
            component: load('Pages/User/UserProfile')
        },
        {
            path: 'timeline',
            name: 'Timeline Page',
            meta: { requiresAuth: true },
            component: load('Pages/TimeLinePage')
        },
        {
            path: 'rtl',
            name: 'وحة القيادة',
            meta: {
                requiresAuth: true,
                rtlActive: true
            },
            component: load('Pages/RtlSupport')
        }
    ]
};
const Settings = {
    path: 'settings',
    component: load('Layout/DashboardLayout'),
    name: 'Settings',
    meta: { requiresAuth: true },
    redirect: 'user',
    children: [{
        path: 'user',
        name: 'My Profile',
        meta: { requiresAuth: true },
        component: load('Pages/User/UserProfile')
    }]
};

const authPages = {
    path: '',
    component: load('Pages/AuthLayout'),
    name: 'Authentication',
    meta: { requiresAuth: false },
    redirect: `/${Trans.getUserSupportedLang()}/login`,
    children: [{
            path: 'login',
            name: 'Login',
            meta: { requiresAuth: false },
            component: load('Pages/Login')
        },
        {
            path: 'choose_clinic',
            name: 'Clinic Selection',
            meta: { requiresAuth: true },
            component: load('Pages/ClinicSelect')
                // beforeEnter: ifAuthenticatedNotselectedClinic,
        },
        {
            path: 'register',
            name: 'Register',
            meta: { requiresAuth: false },
            component: load('Pages/Registration/Wizard')
        },
        {
            path: 'pricing',
            name: 'Pricing',
            meta: { requiresAuth: false },
            component: load('Pages/Pricing')
        },
        {
            path: 'lock',
            name: 'Lock',
            meta: { requiresAuth: false },
            component: load('Pages/Lock')
        }
    ]
};

const patientPages = {
    path: 'patient',
    component: load('Layout/DashboardLayout'),
    name: 'PatientTreatmentent',
    meta: { requiresAuth: true },
    redirect: '/:lang/patient/:patientID/treatment',

    children: [{
        path: ':patientID',
        components: {
            default: load('Pages/Patient/PatientProfile')
        },
        name: 'PatientTreatmententItems',
        meta: {
            requiresAuth: true,
            disableScroll: true
        },
        // redirect: `/:lang/patient/:patientID/treatment`,
        children: [{
                path: 'notes',
                name: 'Notes',
                meta: {
                    requiresAuth: true,
                    disableScroll: true
                },
                components: {
                    Notes: load('Pages/Patient/Notes')
                }
            },
            {
                path: 'bio',
                name: 'Bio',
                meta: {
                    requiresAuth: true,
                    disableScroll: true
                },
                components: {
                    Bio: load('Pages/Patient/PatientBio/PatientBio')
                }
            },
            {
                path: 'files',
                name: 'Files',
                meta: {
                    requiresAuth: true,
                    disableScroll: true
                },
                components: {
                    Files: load('Pages/Patient/PatientFiles/PatientFiles')
                }
            },
            {
                path: 'billing',
                name: 'Billing',
                meta: {
                    requiresAuth: true,
                    disableScroll: true
                },
                redirect: '/:lang/patient/:patientID/billing/unbilled_procedures',
                components: {
                    Billing: load(
                        'Pages/Patient/PatientBilling/PatientBilling'
                    )
                },
                children: [{
                        path: 'unbilled_procedures',
                        name: 'unbilledProcedures',
                        meta: {
                            requiresAuth: true,
                            disableScroll: true
                        },
                        component: load(
                            'Pages/Patient/PatientBilling/PatientBillingUnbiledProcedures'
                        )
                    },
                    {
                        path: 'invoices',
                        name: 'invoices',
                        meta: {
                            requiresAuth: true,
                            disableScroll: true
                        },
                        component: load(
                            'Pages/Patient/PatientBilling/PatientBillingInvoices'
                        )
                    },
                    {
                        path: 'payments',
                        name: 'payments',
                        meta: {
                            requiresAuth: true,
                            disableScroll: true
                        },
                        component: load(
                            'Pages/Patient/PatientBilling/PatientBillingPayments'
                        )
                    }
                ]
            },
            {
                path: 'treatment',
                name: 'Treatment',
                meta: {
                    requiresAuth: true,
                    disableScroll: true
                },
                components: {
                    treatmentchild: load(
                        'Pages/Patient/PatientTreatment/PatientTreatment'
                    )
                },
                // redirect: '/:lang/patient/:patientID/treatment/plan',
                children: [{
                        path: 'diagnosis',
                        name: 'diagnosis',
                        meta: {
                            type: 'diagnosis',
                            requiresAuth: true,
                            disableScroll: true
                        },
                        components: {
                            search: load(
                                'Pages/Patient/PatientTreatment/PatientItemsSearch/PatientDiagnosisSearch'
                            ),
                            list: load(
                                'Pages/Patient/PatientTreatment/PatientItemsLists/PatientDiagnosisList'
                            )
                        }
                    },
                    {
                        path: 'anamnesis',
                        name: 'anamnesis',
                        meta: {
                            type: 'anamnesis',
                            requiresAuth: true,
                            disableScroll: true
                        },
                        components: {
                            search: load(
                                'Pages/Patient/PatientTreatment/PatientItemsSearch/PatientAnamnesisSearch'
                            ),
                            list: load(
                                'Pages/Patient/PatientTreatment/PatientItemsLists/PatientAnamnesisList'
                            )
                        }
                    },
                    {
                        path: 'plan',
                        name: 'plan',
                        meta: {
                            type: 'procedures',
                            requiresAuth: true,
                            disableScroll: false
                        },
                        components: {
                            search: load(
                                'Pages/Patient/PatientTreatment/PatientItemsSearch/PatientProceduresSearch'
                            ),
                            list: load(
                                'Pages/Patient/PatientTreatment/PatientItemsLists/PatientPlansList'
                            ),
                            itemsList: load(
                                'Pages/Patient/PatientTreatment/PatientItemsLists/PatientPlansList'
                            )
                        },
                        children: [{
                            path: ':planID',
                            name: 'procedures',
                            meta: {
                                type: 'procedures',
                                requiresAuth: true,
                                disableScroll: true
                            },
                            component: load(
                                'Pages/Patient/PatientTreatment/PatientItemsLists/PatientProceduresList'
                            ),
                            // children: [{
                            //     path: 'procedures',
                            //     name: 'procedures',
                            //     meta: {
                            //         type: 'procedures',
                            //         requiresAuth: true,
                            //         disableScroll: true
                            //     },
                            //     component: load(
                            //         'Pages/Patient/PatientTreatment/PatientItemsLists/ItemsList'
                            //     )
                            // }]
                        }]
                    }
                ]
            }
        ]
    }]
};

const clinicPages = {
    path: 'clinic/:clinicId',
    component: load('Layout/DashboardLayout'),
    name: 'Clinic',
    meta: { requiresAuth: true },
    redurect: 'Clinic Settings',
    children: [{
            path: 'settings',
            name: 'Clinic Settings',
            meta: { requiresAuth: true },
            component: load('Pages/Clinic/ClinicSettings')
        },
        {
            path: 'consumables',
            name: 'Consumables',
            meta: { requiresAuth: true },
            component: load('Pages/Clinic/ClinicSettings')
        },
        {
            path: 'procedures',
            name: 'Clinic Procedures',
            meta: { requiresAuth: true },
            component: load('Pages/Clinic/ClinicSettings')
        },
        {
            path: 'manipulations',
            name: 'Manipulations',
            meta: { requiresAuth: true },
            component: load('Pages/Clinic/ClinicSettings')
        }
    ]
};

const routes = [{
        path: '',
        redirect() {
            return Trans.getUserSupportedLang();
        }
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
                redirect: '/:lang/dashboard',
                component: load('Layout/DashboardLayout'),
                children: [{
                        path: 'dashboard',
                        name: 'Dashboard',
                        meta: { requiresAuth: true },
                        component: load('Dashboard')
                    },
                    {
                        path: 'calendar',
                        name: 'Calendar',
                        meta: { requiresAuth: true },
                        component: load('Calendar')
                    },
                    {
                        path: 'charts',
                        name: 'Charts',
                        meta: { requiresAuth: true },
                        component: load('Charts')
                    },
                    {
                        path: 'widgets',
                        name: 'Widgets',
                        meta: { requiresAuth: true },
                        component: load('Widgets')
                    },
                    {
                        path: 'patients',
                        name: 'Patients',
                        meta: { requiresAuth: true },
                        component: load('Pages/Patients/PatientsList')
                    },
                    {
                        path: '*',
                        component: () =>
                            import ('@/pages/404.vue')
                    }
                ]
            },
            {
                path: '*',
                component: () =>
                    import ('@/pages/404.vue')
            }
        ]
    }
];

export default routes;

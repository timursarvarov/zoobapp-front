export default {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.userName,
    teethSystem: state => state.teethSystem,
    favoriteDiagnosis: state => state.favoriteDiagnosis,
    favoriteAnamnesis: state => state.favoriteAnamnesis,
    favoriteProcedures: state => state.favoriteProcedures,
    procedureDescriptions: state => state.procedureDescriptions,
    anamnesDescriptions: state => state.anamnesDescriptions,
    diagnoseDescriptions: state => state.diagnoseDescriptions,
    availablePatientsTableColumns: state => state.availablePatientsTableColumns,
    availableItemsTableColumns: state => state.availableItemsTableColumns,
    availableBillingTableColumns: state => state.availableBillingTableColumns,
    availableInvoiceTableColumns: state => state.availableInvoiceTableColumns,
    getLang: (state) => {
        if (state.profile.lang === 1) {
            return 'en';
        }
        if (state.profile.lang === 2) {
            return 'ru';
        }
        return 'en';
    },
};
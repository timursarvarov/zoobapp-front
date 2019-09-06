import { LOCAL_STORAGE, AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants';

export default {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.ID,
    teethSystem: state => state.teethSystem,
    favoriteAnamnesis() {
        const favoriteItems = localStorage.getItem([LOCAL_STORAGE.favoriteItems.anamnesis]);
        return favoriteItems ? JSON.parse(favoriteItems) : [];
    },
    favoriteProcedures() {
        const favoriteItems = localStorage.getItem([LOCAL_STORAGE.favoriteItems.procedures]);
        return favoriteItems ? JSON.parse(favoriteItems) : [];
    },
    favoriteDiagnosis() {
        const favoriteItems = localStorage.getItem([LOCAL_STORAGE.favoriteItems.diagnosis]);
        return favoriteItems ? JSON.parse(favoriteItems) : [];
    },
    procedureDescriptions: state => state.procedureDescriptions,
    anamnesDescriptions: state => state.anamnesDescriptions,
    diagnoseDescriptions: state => state.diagnoseDescriptions,
    availablePatientsTableColumns: state => state.availablePatientsTableColumns,
    getAvailableAnamnesTableColumns: state => state.availableAnamnesTableColumns,
    getAvailableDiagnosisTableColumns: state => state.availableDiagnosisTableColumns,
    getAvailableProceduresTableColumns: state => state.availableProceduresTableColumns,
    getAvailableBillingTableColumns: state => state.availableBillingTableColumns,
    getAvailableInvoiceTableColumns: state => state.availableInvoiceTableColumns,
    getLang: (state) => {
        if (state.profile.ID) {
            return state.profile.lang;
        }
        const systemLang = navigator.language.split('-')[0];
        const undefinedUserLanguage = localStorage.getItem(LOCAL_STORAGE.undefinedUser.lang);
        if (undefinedUserLanguage && undefinedUserLanguage in AVAILABLE_LANGUAGES) {
            return undefinedUserLanguage;
        }
        if (systemLang && systemLang in AVAILABLE_LANGUAGES) {
            return systemLang;
        }
        return DEFAULT_LANGUAGE;
    },
};

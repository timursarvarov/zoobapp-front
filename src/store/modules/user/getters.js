import { LOCAL_STORAGE, AVAILABLE_LANGUAGES } from '@/constants';

export default {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.ID,
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
        if (state.profile.ID) {
            if (state.profile.lang === 1) {
                return 'en';
            }
            if (state.profile.lang === 2) {
                return 'ru';
            }
            if (state.profile.lang === 3) {
                return 'uz';
            }
        }
        const systemLang = navigator.language.split('-')[0];
        const undefinedUserLanguage = localStorage.getItem(LOCAL_STORAGE.undefinedUser.lang);
        if (undefinedUserLanguage && undefinedUserLanguage in AVAILABLE_LANGUAGES) {
            return undefinedUserLanguage;
        }
        if (systemLang && systemLang in AVAILABLE_LANGUAGES) {
            return systemLang;
        }

        return 'en';
    },
};

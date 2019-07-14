import {
    COMPANY_NAME,
    COMPANY_LOGO_URL,
    COMPANY_COLOR,
    COMPANY_LINK,
} from '@/constants';

export default {
    getCurrentManipulations: state => state.clinic.manipulations || [],
    getCurrentDiagnosis: state => state.clinic.diagnosis || [],
    getCurrentProcedures: state => state.clinic.procedures || [],
    getCurrentClinic: (state) => {
        const clinic = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key in state.clinic) {
            // eslint-disable-next-line
            if (state.clinic.hasOwnProperty(key)) {
                if (key === 'name' && !state.clinic[key]) {
                    clinic[key] = COMPANY_NAME;
                } else if (key === 'logo' && !state.clinic[key]) {
                    clinic[key] = COMPANY_LOGO_URL;
                } else if (key === 'color' && !state.clinic[key]) {
                    clinic[key] = COMPANY_COLOR;
                } else if (key === 'url' && !state.clinic[key]) {
                    clinic[key] = COMPANY_LINK;
                } else {
                    clinic[key] = state.clinic[key];
                }
            }
        }
        return clinic;
    },
};
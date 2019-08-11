import {
    COMPANY_NAME,
    COMPANY_LOGO_URL,
    COMPANY_COLOR,
    COMPANY_LINK,
} from '@/constants';

export default {
    getCurrentManipulations: state => state.manipulations || [],
    getCurrentDiagnosis: state => state.diagnosis || [],
    getCurrentProcedures: state => state.procedures || [],
    getCurrentClinic: (state) => {
        const clinic = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key in state) {
            // eslint-disable-next-line
            if (state.hasOwnProperty(key)) {
                if (key === 'name' && !state[key]) {
                    clinic[key] = COMPANY_NAME;
                } else if (key === 'logo' && !state[key]) {
                    clinic[key] = COMPANY_LOGO_URL;
                } else if (key === 'color' && !state[key]) {
                    clinic[key] = COMPANY_COLOR;
                } else if (key === 'url' && !state[key]) {
                    clinic[key] = COMPANY_LINK;
                } else {
                    clinic[key] = state[key];
                }
            }
        }
        return clinic;
    },
};
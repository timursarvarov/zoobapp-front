import {
    COMPANY_NAME,
    COMPANY_LOGO_URL,
    COMPANY_COLOR,
    COMPANY_LINK,
} from '@/constants';

export default {
    getCurrentManipulations: state => state.manipulations || [],
    getUngroupedProcedures: state => state.procedures || [],
    getUngroupedDiagnosis: state => state.diagnosis || [],
    getCurrentClinic: (state) => {
        const clinic = {};
        Object.keys(state).forEach((key) => {
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
        });
        return clinic;
    },
    getCurrentDiagnosis: (state, getters) => {
        const diagnosis = [];
        if (state.diagnosis) {
            state.diagnosis.forEach((group) => {
                diagnosis.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters.getPatientAgeCategory)),
                });
            });
        }
        return diagnosis;
    },
    getCurrentProcedures: (state, getters) => {
        const procedures = [];
        if (state.procedures) {
            state.procedures.forEach((group) => {
                procedures.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters.getPatientAgeCategory)),
                });
            });
        }
        return procedures;
    },
    getCurrentAnamnesis: (state, getters) => {
        const anamnesis = [];
        if (state.anamnesis) {
            state.anamnesis.forEach((group) => {
                anamnesis.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters.getPatientAgeCategory)),
                });
            });
        }
        return anamnesis;
    },
};
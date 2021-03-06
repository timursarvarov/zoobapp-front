import { COMPANY_NAME, COMPANY_LOGO_URL, COMPANY_COLOR, STORE_KEY_PATIENT, COMPANY_LINK, COMMON_CURRENCY } from '@/constants';

export default {
    getCurrentManipulations: state => {
        let manipulations = [];
        if (state.manipulations) {
            state.manipulations.forEach(m => {
                manipulations.push({
                    ...m,
                    text: `${m.code} - ${m.title}`
                });
            });
        }
        return manipulations;
    },
    getCurrency: state => COMMON_CURRENCY[state.currencyCode].symbol,
    getUngroupedProcedures: state => state.ungroupedprocedures || [],
    getUngroupedAnamnesis: state => state.ungroupedanamnesis || [],
    getUngroupedDiagnosis: state => state.ungroupeddiagnosis || [],
    getCurrentClinic: state => {
        const clinic = {};
        Object.keys(state).forEach(key => {
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
    getCurrentClinicDiagnosis: (state, getters) => {
        const diagnosis = [];
        if (state.diagnosis) {
            state.diagnosis.forEach(group => {
                diagnosis.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters[`${STORE_KEY_PATIENT}/getPatientAgeCategory`]))
                });
            });
        }
        return diagnosis;
    },
    getCurrentClinicProcedures: (state, getters) => {
        const procedures = [];
        if (state.procedures) {
            state.procedures.forEach(group => {
                procedures.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters[`${STORE_KEY_PATIENT}/getPatientAgeCategory`]))
                });
            });
        }
        return procedures;
    },
    getCurrentClinicAnamnesis: (state, getters) => {
        const anamnesis = [];
        if (state.anamnesis) {
            state.anamnesis.forEach(group => {
                anamnesis.push({
                    title: group.title,
                    code: group.code,
                    codes: group.codes.filter(item => item.ageCategory.includes(getters[`${STORE_KEY_PATIENT}/getPatientAgeCategory`]))
                });
            });
        }
        return anamnesis;
    },
    getCurrentClinicOriginalItem: state => (type, catalogID) => {
        let item = {};
        if (state[`ungrouped${type}`]) {
            item = state[`ungrouped${type}`][catalogID];
        }
        return item || {};
    }
};

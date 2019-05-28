import {
    COMPANY_NAME,
    COMPANY_LOGO_URL,
    COMPANY_COLOR,
    COMPANY_LINK,
    DIAGNOSIS,
    PROCEDURES,
    LOCATIONS,
} from '@/constants';

export default {
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
    getDiagnosis: () => {
        const diagnosis = [];
        DIAGNOSIS.forEach((diagnoseGroup, indexGroup) => {
            diagnosis[indexGroup] = {};
            diagnosis[indexGroup].code = diagnoseGroup.code;
            diagnosis[indexGroup].title = diagnoseGroup.title;
            diagnosis[indexGroup].codes = [];
            diagnoseGroup.codes.forEach((diagnose) => {
                diagnosis[indexGroup].codes.push({
                    ...diagnose,
                    ...LOCATIONS[diagnose.templateCode],
                });
            });
        });
        return diagnosis;
    },
    getProcedures: () => {
        const procedures = [];
        PROCEDURES.forEach((procedureGroup, indexGroup) => {
            procedures[indexGroup] = {};
            procedures[indexGroup].code = procedureGroup.code;
            procedures[indexGroup].title = procedureGroup.title;
            procedures[indexGroup].codes = [];
            procedureGroup.codes.forEach((procedure) => {
                procedures[indexGroup].codes.push({
                    ...procedure,
                    ...LOCATIONS[procedure.templateCode],
                });
            });
        });
        return procedures;
    },
};
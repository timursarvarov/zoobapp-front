/* eslint-disable no-tabs */
import { TEETH_INITIATION, TEETH_INITIATION_ETHALON } from '@/constants';
import state from './state';

export default {
    [TEETH_INITIATION]: ({ commit }, { patient }) => {
        const jaw = {
            anamnesis: {},
            procedures: {},
            diagnosis: {},
        };
        // настраиваем челюсть
        const patientJawProps = {};
        if (patient.plans) {
            const plan = Object.values(patient.plans).find(planL => planL.state === 1);
            if (plan) {
                patientJawProps.procedures = patient.plans[plan.ID];
            }
            commit(TEETH_INITIATION, { type: 'procedures', value: jaw.procedures });
        }
        if (patient.diagnosis) {
            patientJawProps.diagnosis = patient.diagnosis;
            // генерируем челюсь для отображения всех диагнозов и процедур
            Object.keys(patientJawProps).forEach((jawType) => {
                const { teeth } = patientJawProps[jawType];
                if (teeth) {
                    Object.keys(teeth).forEach((toothId) => {
                        Object.keys(teeth[toothId]).forEach((location) => {
                            if (!(toothId in jaw[jawType])) {
                                jaw[jawType][toothId] = {};
                            }
                            jaw[jawType][toothId][location] = patientJawProps[jawType][location];
                        });
                    });
                }
            });
        }

        commit(TEETH_INITIATION, { type: 'diagnosis', value: jaw.diagnosis });
        commit(TEETH_INITIATION, { type: 'anamnesis', value: jaw.anamnesis });
    },
    [TEETH_INITIATION_ETHALON]: ({ commit }) => {
        const jaw = {
            anamnesis: {},
            procedures: {},
            diagnosis: {},
        };
        // настраиваем челюсть
        Object.keys(jaw).forEach((jawType) => {
            state.teethAll.forEach((toothId) => {
                jaw[jawType][toothId] = {};
                Object.keys(state.toothLocations).forEach((location) => {
                    jaw[jawType][toothId][location] = state.toothLocations[location];
                });
            });
        });
        const jawEthalon = {};
        // eslint-disable-next-line
        for (let attr in jaw) {
            // eslint-disable-next-line
            if (jaw.hasOwnProperty(attr)) jawEthalon[attr] = jaw[attr];
        }
        commit(TEETH_INITIATION_ETHALON, jawEthalon);
    },
};
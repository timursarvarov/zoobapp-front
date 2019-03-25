import { TEETH_INITIATION, TEETH_INITIATION_ETHALON } from '@/constants';
import state from './state';

export default {
  [TEETH_INITIATION]: ({ commit }) => {
    if (Object.keys(state.jaw).length === 0) {
      const jaw = {
        jawAnamnes: {},
        jawTreatment: {},
        jawDiagnose: {},
      };
      Object.keys(jaw).forEach((jawType) => {
        for (let i = 0; i < state.teethAll.length; i += 1) {
          jaw[jawType][state.teethAll[i]] = {};
          Object.keys(state.toothLocations).forEach((key) => {
            jaw[jawType][state.teethAll[i]][key] = state.toothLocations[key];
          });
        }
      });
      commit(TEETH_INITIATION, jaw);
      const jawEthalon = {};
      // eslint-disable-next-line
      for (let attr in jaw) {
        // eslint-disable-next-line
        if (jaw.hasOwnProperty(attr)) jawEthalon[attr] = jaw[attr];
      }

      commit(TEETH_INITIATION_ETHALON, jawEthalon);
    }
  },
};

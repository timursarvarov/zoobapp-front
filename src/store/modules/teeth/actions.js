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
      // настраиваем челюсть
      Object.keys(jaw).forEach((jawType) => {
        state.teethAll.forEach((toothId) => {
          jaw[jawType][toothId] = {};
          Object.keys(state.toothLocations).forEach((location) => {
            jaw[jawType][toothId][location] = state.toothLocations[location];
          });
        });
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

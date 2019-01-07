import {
  TEETH_INITIATION,
} from '../constants';
import state from './state';

export default {
  [TEETH_INITIATION]: ({
    commit,
  }) => {
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
    }
  },
};

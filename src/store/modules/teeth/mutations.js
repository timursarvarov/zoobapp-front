/* eslint-disable */
import {
  TEETH_INITIATION,
} from '../constants';

export default {
  [TEETH_INITIATION]: (state, jaw) => {
    state.jaw = jaw;
  },
};
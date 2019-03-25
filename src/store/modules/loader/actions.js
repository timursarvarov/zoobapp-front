/* eslint-disable */
import {
  LOADER_START,
  LOADER_STOP,
} from '@/constants';

export default {
  [LOADER_START]: ({commit}) => {
    commit(LOADER_START);
  },
  [LOADER_STOP]: ({commit}) => {
    commit(LOADER_STOP);
  },
};
